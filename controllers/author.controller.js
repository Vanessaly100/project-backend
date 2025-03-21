const authorService = require("../services/author.service");

//  Create a new author
const createAuthor = async (req, res) => {
  try {
    const newAuthor = await authorService.createAuthor(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Get all authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors({ attributes: ["author_id", "name"] });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  Get author by name
const getAuthorByName = async (req, res) => {
  try {
    const { name } = req.params;
    const author = await authorService.getAuthorByName(name);
    
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  Get a single author by ID
const getAuthorById = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found" });

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update an author
const updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await authorService.updateAuthor(req.params.id, req.body);
    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Delete an author
const deleteAuthor = async (req, res) => {
  try {
    const response = await authorService.deleteAuthor(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorByName,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
