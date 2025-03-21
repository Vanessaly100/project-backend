const bookService = require("../services/book.service");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.book_id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await bookService.updateBook(req.params.book_id, req.body);
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const success = await bookService.deleteBook(req.params.book_id);
    if (!success) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
