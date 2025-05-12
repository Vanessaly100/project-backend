const { Book, Author, Category,Borrow,Genre } = require("../models");
const sequelize = require("../config/database");
const { Op, fn, col, cast, where } = require("sequelize");


const getAllBooks = async ({
  page = 1,
  limit = 10,
  sortBy = "title",
  sortOrder = "ASC",
  filter = {}, // Now an object with multiple filters
}) => {
  const offset = (page - 1) * limit;
  const isNumeric = !isNaN(filter) && filter.trim() !== "";
  const searchConditions = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${filter}%` } },
      { "$genres.name$": { [Op.iLike]: `%${filter}%` } },
      { "$author.name$": { [Op.iLike]: `%${filter}%` } },
    ],
  };

  // Add numeric filter condition for publication_year
  if (isNumeric) {
    searchConditions[Op.or].push(
      where(cast(col("Book.publication_year"), "TEXT"), {
        [Op.iLike]: `%${filter}%`,
      })
    );
  }

  const books = await Book.findAndCountAll({
    where: filter ? searchConditions : {}, // Apply searchConditions if filter is not empty
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    subQuery: false,
    include: [
      {
        model: Author,
        as: "author",
        attributes: ["author_id", "name"],
        required: false,
      },
      {
        model: Category,
        as: "category",
        attributes: ["category_id", "name"],
        required: false,
      },
      {
        model: Genre,
        as: "genres",
        attributes: ["genre_id", "name"],
        through: { attributes: [] },
        required: false,
      },
    ],
  });


  const booksWithAvailability = books.rows.map((book) => {
    const borrowedCopies = book.borrows ? book.borrows.length : 0;
    const availableCopies = book.totalCopies - borrowedCopies;

    return {
      id: book.book_id,
      title: book.title,
      author: book.author?.name || null,
      category: book.category?.name || null,
      CoverImage: book.cover_url,
      genres: book.genres.map((g) => g.name),
      publishedYear: book.publication_year,
      totalCopies: book.totalCopies,
      borrowedCopies: book.totalCopies - book.available_copies,
      availableCopies: book.available_copies,
      isAvailable: availableCopies > 0,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  });

  return {
    books: booksWithAvailability,
    pagination: {
      totalItems: books.count,
      totalPages: Math.ceil(books.count / limit),
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(books.count / limit),
      hasPreviousPage: page > 1,
    },
  };
};


const getBookById = async (book_id) => {
  console.log("book result", book_id )
  return await Book.findByPk(book_id, {
    include: [
      { model: Author, as: "author", attributes: ["author_id", "name"] },
      { model: Category, as: "category", attributes: ["category_id", "name"] },
    ],
  });
};

const createBook = async (bookData) => {
  return await Book.create(bookData);
};

const updateBook = async (bookId, bookData) => {
    const {title,category,author,genre,cover_url,publishedYear,
totalCopies,availableCopies,} = bookData;
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Find or create the author
    const [authorRecord] = await Author.findOrCreate({
      where: { name: author },
    });

    // Find or create the category
    const [categoryRecord] = await Category.findOrCreate({
      where: { name: category },
    });

    // Update the book fields
    await book.update({
      title,
      cover_url,
      publication_year: publishedYear,
      totalCopies,
      available_copies: availableCopies,
      author_id: authorRecord.author_id,
      category_id: categoryRecord.category_id,
    });

    // Update genre associations
    if (Array.isArray(genre) && genre.length > 0) {
      await book.setGenres(genre); // Accepts array of genre_ids
      console.log(`Genres updated successfully for book: ${bookId}`);
    }

    // Fetch the fully updated book with associations
    const updatedBook = await Book.findByPk(bookId, {
      include: [
        { 
          model: Genre,
          as: "genres",
          through: { attributes: [] },
        },
        {
          model: Author,as: "author",
          attributes: ["name"],
        },
        {
          model: Category,as: "category",
          attributes: ["name"],
        },
      ],
    });

    return updatedBook;
};


const deleteBook = async (book_id) => {
  const book = await Book.findByPk(book_id);
  if (!book) {
    console.error("Book not found:", book_id);
    throw new Error("Book not found");
  }
  await book.destroy();
  console.log("Book deleted successfully");
  return { message: "Book deleted successfully" };
};


module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
