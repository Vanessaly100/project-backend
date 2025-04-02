const { ValidationException, NotFoundException, InternalServerErrorException } = require("../lib/errors.definitions");
const { asyncWrapper, validate } = require("../lib/utils"); // import asyncWrapper and validate
const bookService = require("../services/book.service");
const bookSchema = require("../validators/book.validation");

exports.getAllBooks = asyncWrapper(async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    throw new InternalServerErrorException("Error fetching books");
  }
});

exports.getBookById = asyncWrapper(async (req, res) => {
  const book = await bookService.getBookById(req.params.book_id);
  if (!book) {
    throw new NotFoundException("Book not found");
  }
  res.json(book);
});

exports.createBook = asyncWrapper(async (req, res) => {
  const { errors, value } = validate(bookSchema, req);

  if (errors) {
    throw new ValidationException("Validation failed", errors);
  }

  try {
    const newBook = await bookService.createBook(value);
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    throw new InternalServerErrorException("Error creating book");
  }
});

exports.updateBook = asyncWrapper(async (req, res) => {
  const { errors, value } = validate(bookSchema, req);

  if (errors) {
    throw new ValidationException("Validation failed", errors);
  }

  try {
    const updatedBook = await bookService.updateBook(req.params.book_id, value);
    if (!updatedBook) {
      throw new NotFoundException("Book not found");
    }
    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    throw new InternalServerErrorException("Error updating book");
  }
});

exports.deleteBook = asyncWrapper(async (req, res) => {
  try {
    const success = await bookService.deleteBook(req.params.book_id);
    if (!success) {
      throw new NotFoundException("Book not found");
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    throw new InternalServerErrorException("Error deleting book");
  }
});
