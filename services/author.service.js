const { Author } = require("../models");


const getAuthorByName = async (name) => {
  return await Author.findOne({ where: { name } });
};


const createAuthor = async (authorData) => {
  return await Author.create(authorData);
};

const getAllAuthors = async () => {
  return await Author.findAll();
};

const getAuthorById = async (author_id) => {
  return await Author.findByPk(author_id);
}; 

const updateAuthor = async (author_id, updatedData) => {
  const author = await Author.findByPk(author_id);
  if (!author) throw new Error("Author not found");

  return await author.update(updatedData);
};

const deleteAuthor = async (author_id) => {
  const author = await Author.findByPk(author_id);
  if (!author) throw new Error("Author not found");

  await author.destroy();
  return { message: "Author deleted successfully" };
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  getAuthorByName, 
  updateAuthor,
  deleteAuthor,
};
