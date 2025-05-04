const authorService = require("../services/author.service");
const asyncHandler = require("express-async-handler");
const {
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");

// Create a new author
const createAuthor = asyncHandler(async (req, res) => {
  const newAuthor = await authorService.createAuthor(req.body);
  res.status(201).json(newAuthor);
});

//  Get all authors with pagination, sorting, filtering
const getAllAuthors = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "ASC",
    filter = "",
  } = req.query;

  const { totalAuthors, Authors } = await authorService.getAllAuthors(
    { page, limit, sort, order, filter },
    { attributes: ["author_id", "name"] }
  );

  res.json({ totalAuthors, Authors });
});

//  Get author by name
const getAuthorByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const author = await authorService.getAuthorByName(name);

  if (!author) {
    throw new NotFoundException("Author not found");
  }

  res.json(author);
});

//  Get author by ID
const getAuthorById = asyncHandler(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.id);

  if (!author) {
    throw new NotFoundException("Author not found");
  }

  res.status(200).json(author);
});

//  Update an author
const updateAuthor = asyncHandler(async (req, res) => {
  const updatedAuthor = await authorService.updateAuthor(
    req.params.id,
    req.body
  );

  if (!updatedAuthor) {
    throw new NotFoundException("Author not found or update failed");
  }

  res.status(200).json(updatedAuthor);
});

//  Delete an author
const deleteAuthor = asyncHandler(async (req, res) => {
  const deleted = await authorService.deleteAuthor(req.params.id);

  if (!deleted) {
    throw new NotFoundException("Author not found or could not be deleted");
  }
 
  res.status(200).json({ message: "Author deleted successfully" });
});

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorByName,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
