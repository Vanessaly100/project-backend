const { Category, Book } = require("../models");
const { Op } = require("sequelize");
const { InternalServerErrorException } = require("../lib/errors.definitions");

exports.createCategory = async (data) => {
  return await Category.create(data);
};

exports.getAllCategoryNoLimit = async () => {
  return await Category.findAll();
};

exports.getAllCategories = async ({
  page = 1,
  limit = 7,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => {

    const pageInt = parseInt(page, 10); // Convert to integer
    const limitInt = parseInt(limit, 10);

    const categories = await Category.findAndCountAll(
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

   const totalPages = Math.ceil(categories.count / limitInt);

    return {
      categories: categories.rows,
      pagination: {
        totalItems: categories.count,
        currentPage: pageInt,
        totalPages,
        pageSize: limitInt,
      },
    };

};


exports.getCategoryById = async (category_id) => {
  return await Category.findByPk(category_id, {
    include: [{ association: "books" }],
  });
};

exports.updateCategoryById = async (category_id, updatedData) => {
  const category = await Category.findByPk(category_id);
  if (!category) return null;
  return await category.update(updatedData);
}; 



exports.deleteCategory = async (categoryId) => {
  const booksUsingCategory = await Book.findAll({
    where: { category_id: categoryId },
  });

  if (booksUsingCategory.length > 0) {
    throw new Error(
      "Cannot delete category: Books are still assigned to this category."
    );
  }
  await Category.destroy({ where: { category_id: categoryId } });
  return { message: "Category deleted successfully" };
};
