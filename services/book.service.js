const { Book, Author, Category,Borrow,Genre } = require("../models");
// const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Op, fn, col, cast, where } = require("sequelize");


// const getAllBooks = async (
  // {
//   page = 1,
//   limit = 10,
//   sort = "createdAt",
//   order = "desc",
//   filter = "",
// } = {}) => {
  // try {
  //   const pageInt = parseInt(page);
  //   const limitInt = parseInt(limit);

  //   const books = await Book.findAll({
  //     include: [
  //       { model: Author, as: "author", attributes: ["name"] },
  //       { model: Category, as: "category", attributes: ["name"] },
  //       {
  //         model: Borrow,
  //         as: "borrows",
  //         where: { status: "Borrowed" },
  //         required: false,
  //       },
  //     ],
  //     where: {
  //       [Op.or]: [
  //         { title: { [Op.iLike]: `%${filter}%` } },
  //         { genre: { [Op.iLike]: `%${filter}%` } },
  //       ],
  //     },
  //     order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
  //     limit: limitInt,
  //     offset: (pageInt - 1) * limitInt,
  //   });

//     if (!Array.isArray(books)) {
//       console.log("BOOKS IS NOT AN ARRAY:", books);
//       throw new Error("Unexpected data type for books");
//     }

//     console.log("Raw books result:", books); 

//     const booksWithAvailable = books.map((book) => {
//       const borrowedCount = book.borrows?.length || 0;
//       return {
//         ...book.toJSON(),
//         available_copies: book.total_copies - borrowedCount,
//       };
//     });

//     const totalBooks = await Book.count();

//     return { booksWithAvailable, totalBooks };
//   } catch (error) {
//     console.error("Error fetching books:", error.message);
//     throw new Error("Could not fetch books");
//   }
// };


// const getAllBooks = async ({
//   page = 1,
//   limit = 10,
//   sortBy = "title",
//   sortOrder = "ASC",
//   filters = {},
// }) => {
//   const offset = (page - 1) * limit;

//   const whereClause = {
//     [Op.or]: [
//       { title: { [Op.iLike]: `%${filters}%` } },
//       { genre: { [Op.iLike]: `%${filters}%` } },
//       { "$author.name$": { [Op.iLike]: `%${filters}%` } },
//       { publication_year: { [Op.iLike]: `%${filters}%` } },
//     ],
//   };
//   const { count, rows: books } = await Book.findAndCountAll({
//     where: whereClause,
//     order: [[sortBy, sortOrder]],
//     limit,
//     offset,
//     subQuery: false,
//     include: [
//       {
//         model: Author,
//         as: "author",
//         attributes: ["author_id", "name"],
//         required: false,
//       },
//       {
//         model: Category,
//         as: "category",
//         attributes: ["category_id", "name"],
//         required: false,
//       },
//       {
//         model: Borrow,
//         as: "borrows",
//         where: { status: "borrowed" },
//         required: false,
//       },
//     ],
//   });

//   const booksWithAvailability = books.map((book) => {
//     const borrowedCopies = book.borrows ? book.borrows.length : 0;
//     const availableCopies = book.totalCopies - borrowedCopies;

//     return {
//       id: book.book_id,
//       title: book.title,
//       author: book.author?.name || null,
//       category: book.category?.name || null,
//       CoverImage: book.cover_url,
//       genre: book.genre,
//       publishedYear: book.publication_year,
//       totalCopies: book.totalCopies,
//       borrowedCopies,
//       availableCopies,
//       isAvailable: availableCopies > 0,
//       CreatedAt:book.createdAt,
//       UpdatedAt:book.updatedAt,
//     };
//   });

//   return {
//     books: booksWithAvailability,
//     pagination: {
//       totalItems: count,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       itemsPerPage: limit,
//       hasNextPage: page < Math.ceil(count / limit),
//       hasPreviousPage: page > 1,
//     },
//   };
// };




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
      borrowedCopies,
      availableCopies,
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

const updateBook = async (book_id, bookData) => {
  const book = await Book.findByPk(book_id);
  if (!book) throw new Error("Book not found");;
  return await book.update(bookData);
};

const deleteBook = async (book_id) => {
  console.log("Attempting to delete book:", book_id);
  console.log("Searching for book_id:", book_id);
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
