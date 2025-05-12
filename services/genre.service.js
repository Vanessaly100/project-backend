const {Genre} = require('../models')
const { Op } = require("sequelize");

exports.getAllGenre = async({page = 1,
  limit = 5,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => {
        const pageInt = parseInt(page, 10); // Convert to integer
        const limitInt = parseInt(limit, 10);
    
        // Fetch author with pagination, sorting, and filtering
        const genres = await Genre.findAndCountAll({
          where: {
            [Op.or]: [{ name: { [Op.iLike]: `%${filter || ""}%` } }],
          },
          order: [
            [
              sort || "createdAt",
              order?.toUpperCase() === "DESC" ? "DESC" : "ASC",
            ],
          ],
          limit: limitInt,
          offset: (pageInt - 1) * limitInt,
        });
    
       const totalPages = Math.ceil(genres.count / limitInt);

    return {
     genres : genres.rows,
      pagination: {
        totalItems: genres.count,
        currentPage: pageInt,
        totalPages,
        pageSize: limitInt,
      },
    };
     
}