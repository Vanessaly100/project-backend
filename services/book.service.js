const { Book, Author, Category } = require("../models");

const getAllBooks = async () => {
  return await Book.findAll({
    include: [
      { model: Author, as: "author", attributes: [ "name"] },
      { model: Category, as: "category", attributes: [ "name"] },
    ],
  });
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
  if (!book) return null;
  await book.update(bookData);
  return book;
};

const deleteBook = async (book_id) => {
  const book = await Book.findByPk(book_id);
  if (!book) return null;
  await book.destroy();
  return true;
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
