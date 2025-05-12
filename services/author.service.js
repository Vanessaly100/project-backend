const { Author } = require("../models");
const { Op } = require("sequelize");

const getAuthorByName = async (name) => {
  return await Author.findOne({ where: { name } });
};


const createAuthor = async (authorData) => {
  return await Author.create(authorData);
};

// Get All author with pagination, sorting, and filtering
const getAllAuthors = async ({
  page = 1,
  limit = 5,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => { 
    const pageInt = parseInt(page, 10);// Convert to integer
    const limitInt = parseInt(limit, 10);

    // Fetch author with pagination, sorting, and filtering
    const authors = await Author.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${filter}%` } },
          { contact: { [Op.iLike]: `%${filter}%` } },
          { email: { [Op.iLike]: `%${filter}%` } },
        ],
      },
      order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
      limit: limitInt,
      offset: (pageInt - 1) * limitInt,
    });
const totalPages = Math.ceil(authors.count / limitInt);

    return {
      authors: authors.rows,
      pagination: {
        totalItems: authors.count,
        currentPage: pageInt,
        totalPages,
        pageSize: limitInt,
      },
    };

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
