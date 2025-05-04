const { Category } = require("../models");
const { Op } = require("sequelize");

exports.createCategory = async (data) => {
  return await Category.create(data);
};


exports.getAllCategories = async ({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => {
  try {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Fetch Category with pagination, sorting, and filtering
    const Categories = await Category.findAll(
      {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${filter || ""}%` } },
            { description: { [Op.iLike]: `%${filter || ""}%` } },
          ],
        },
        order: [
          [
            sort || "createdAt",
            order?.toUpperCase() === "DESC" ? "DESC" : "ASC",
          ],
        ],
        limit: limitInt,
        offset: (pageInt - 1) * limitInt,
      },
      { include: [{ association: "books" }] }
    );

    // Get total author count for pagination
    const totalCategories = await Category.count();

    return { totalCategories, Categories };
  } catch (error) {
    console.error(" Sequelize error in getAllAuthors:", error);
    throw new InternalServerErrorException(
      "Error fetching authors from the database"
    );
  }
};


exports.getCategoryById = async (category_id) => {
  return await Category.findByPk(category_id, {
    include: [{ association: "books" }],
  });
};

exports.updateCategory = async (category_id, updatedData) => {
  console.log("Updating category with data:", updatedData);
  const category = await Category.findByPk(category_id);
  if (!category) return null;
  return await category.update(updatedData);
};



exports.deleteCategory = async (category_id) => {
  const category = await Category.findByPk(category_id);
  if (!category) return null;
  await category.destroy();
  return category;
};


