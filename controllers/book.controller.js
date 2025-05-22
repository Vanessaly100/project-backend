const {
  ValidationException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");
const bookService = require("../services/book.service");
const asyncHandler = require("express-async-handler");


exports.getAllBooks = asyncHandler(async (req, res) => {
  try {
    const filter = req.query.filter || ""; 
    const category = req.query.category || "";
    const result = await bookService.getAllBooks({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || "title",
      sortOrder: req.query.sortOrder || "ASC",
      filter,
      category,
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
  const book = await bookService.getBookById(req.params.id);
  if (!book) {
    throw new NotFoundException("Book not found");
  }
  res.json(book);
});

// CREATE a new book
exports.createBook = asyncHandler(async (req, res) => {
  const bookData = req.body;
  const newBook = await bookService.createBook(bookData);

  if (!newBook) {
    throw new InternalServerErrorException("Error creating book");
  }

  res.status(201).json({ message: "Book created successfully", book: newBook });
});



// UPDATE a book
exports.updateBook = asyncHandler(async (req, res) => {
  console.log("Incoming update data:", req.body);
  const updatedBook = await bookService.updateBook(req.params.id, req.body);
  if (!updatedBook) {
    throw new NotFoundException("Book not found");
  }
  res.json({ message: "Book updated successfully", book: updatedBook });
});

// DELETE a book
exports.deleteBook = asyncHandler(async (req, res) => {
  const result = await bookService.deleteBook(req.params.id);
  res.json(result); 
});

exports.getRecentlyAddedBooks = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const books = await bookService.getRecentlyAddedBooks(limit);
  res.json({ success: true, books });
});