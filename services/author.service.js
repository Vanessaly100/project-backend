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
  limit = 10,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => { 
  try {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Fetch author with pagination, sorting, and filtering
    const Authors = await Author.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${filter || ""}%` } },
          { contact: { [Op.iLike]: `%${filter || ""}%` } },
          { email: { [Op.iLike]: `%${filter || ""}%` } },
        ],
      },
      order: [
        [sort || "createdAt", order?.toUpperCase() === "DESC" ? "DESC" : "ASC"],
      ],
      limit: limitInt,
      offset: (pageInt - 1) * limitInt,
    });

    // Get total author count for pagination
    const totalAuthors = await Author.count();

    return { totalAuthors, Authors };

  } catch (error) {
    console.error(" Sequelize error in getAllAuthors:", error);
    throw new InternalServerErrorException(
      "Error fetching authors from the database"
    );
  }

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
