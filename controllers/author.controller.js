const authorService = require("../services/author.service");
const asyncHandler = require("express-async-handler");
const {
  NotFoundException,
} = require("../lib/errors.definitions");
const { Author } = require("../models");

const fetchAllAuthorsNoLimit = asyncHandler(async (req, res) => {
  const authors = await authorService.getAllAuthorsNoLimit();
  res.status(200).json({ authors });
});


const createAuthor = asyncHandler( async (req, res) => {
  try {
    const { name, email, contact, bio, profile_picture, social_media } =
      req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingAuthor = await Author.findOne({ where: { email } });
    if (existingAuthor) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: {
          email: "This email is already in use",
        },
      });
    }

    const newAuthor = await Author.create({
      name,
      email,
      contact,
      bio,
      profile_picture,
      social_media,
    });

    res.status(201).json(newAuthor);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

const getBookCountPerAuthor = asyncHandler(async (req, res) => {
  const result = await authorService.getBookCountPerAuthor();
  res.json({ success: true, authors: result });
});

module.exports = {
  fetchAllAuthorsNoLimit,
  createAuthor,
  getBookCountPerAuthor,
  getAllAuthors,
  getAuthorByName,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
