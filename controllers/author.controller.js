const authorService = require("../services/author.service");
const asyncHandler = require("express-async-handler");
const {
  NotFoundException,
} = require("../lib/errors.definitions");

// Create a new author
const createAuthor = asyncHandler(async (req, res) => {
  const newAuthor = await authorService.createAuthor(req.body);
  res.status(201).json(newAuthor);
});


const getAllAuthors = asyncHandler(async (req, res) => {
  const result = await authorService.getAllAuthors(req.query);
  
    res.status(200).json({
      authors: result.authors,
      pagination: result.pagination,
    });
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
