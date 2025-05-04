const {
  ValidationException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");
const bookService = require("../services/book.service");
const asyncHandler = require("express-async-handler");
const { Book, Author, Category, Borrow } = require("../models");

// GET all books
// exports.getAllBooks = asyncHandler(async (req, res) => {
//  const { page, limit, sort, order, filter } = req.query;

//   const { totalBooks, Books } = await bookService.getAllBooks({
//     page,
//     limit,
//     sort,
//     order,
//     filter,
//   });
//   //  const { totalAuthors, Authors } = await authorService.getAllAuthors(
//   //     { page, limit, sort, order, filter },
//   //     { attributes: ["author_id", "name"] }
//   //   );

//   res.json({ totalBooks, Books });
// });

// exports.getAllBooks = asyncHandler(async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     // Sorting
//     const sortField = req.query.sortBy || "title";
//     const sortOrder = req.query.sortOrder || "ASC";

//     // Filtering
//     const whereClause = {};
//     if (req.query.title) {
//       whereClause.title = { [Op.like]: `%${req.query.title}%` };
//     }
//     if (req.query.author) {
//       whereClause.author = { [Op.like]: `%${req.query.author}%` };
//     }
//     if (req.query.genre) {
//       whereClause.genre = req.query.genre;
//     }
//     if (req.query.publishedYear) {
//       whereClause.publishedYear = req.query.publishedYear;
//     }

//     // Fetch books with pagination and filtering
//     const { count, rows: books } = await Book.findAndCountAll({
//       where: whereClause,
//       order: [[sortField, sortOrder]],
//       limit,
//       offset,
//       include: [
//         {
//           model: Borrow,
//           as: "borrows",
//           where: { status: "borrowed" },
//           required: false,
//         },
//       ],
//     });

//     // Map books to add availability information
//     const booksWithAvailability = books.map((book) => {
//       const borrowedCopies = book.borrows ? book.borrows.length : 0;
//       const availableCopies = book.totalCopies - borrowedCopies;

//       return {
//         id: book.book_id,
//         title: book.title,
//         author: book.author,
//         // isbn: book.isbn,
//         publishedYear: book.publication_year,
//         genre: book.genre,
//         totalCopies: book.totalCopies,
//         borrowedCopies,
//         availableCopies,
//         isAvailable: availableCopies > 0,
//       };
//     });

//     // Response with pagination metadata
//     const totalPages = Math.ceil(count / limit);

//     res.json({
//       success: true,
//       data: booksWithAvailability,
//       pagination: {
//         totalItems: count,
//         totalPages,
//         currentPage: page,
//         itemsPerPage: limit,
//         hasNextPage: page < totalPages,
//         hasPreviousPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch books",
//       error: error.message,
//     });
//   }
// });


exports.getAllBooks = asyncHandler(async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Ensure the filter is coming through
    console.log("Received filter on backend:", filter); // Log the filter

    const result = await bookService.getAllBooks({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || "title",
      sortOrder: req.query.sortOrder || "ASC",
      filter, // Pass filter string directly
    });

    res.json({
      success: true,
      data: result.books,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});


// GET book by ID
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.book_id);
  if (!book) {
    throw new NotFoundException("Book not found");
  }
  res.json(book);
});

// CREATE a new book
exports.createBook = asyncHandler(async (req, res) => {
  const { errors, value } = req;

  if (errors) {
    throw new ValidationException("Validation failed", errors);
  }

  const newBook = await bookService.createBook(value);
  if (!newBook) {
    throw new InternalServerErrorException("Error creating book");
  }

  res.status(201).json({ message: "Book created successfully", book: newBook });
});

// UPDATE a book
exports.updateBook = asyncHandler(async (req, res) => {
  const updatedBook = await bookService.updateBook(req.params.id, req.body);
  if (!updatedBook) {
    throw new NotFoundException("Book not found");
  }
  res.json({ message: "Book updated successfully", book: updatedBook });
});

// DELETE a book
exports.deleteBook = asyncHandler(async (req, res) => {
  const result = await bookService.deleteBook(req.params.id);
  res.json(result); // Already has { message: "..." }
});
