const { Category } = require("../models");

class CategoryService {
  // Create a new category
  static async createCategory(data) {
    return await Category.create(data);
  }

  //  Fetch all categories
  static async getAllCategories() {
    return await Category.findAll({ include: [{ association: "books" }] });
  }

  //  Fetch category by ID
  static async getCategoryById(category_id) {
    return await Category.findByPk(category_id, { include: [{ association: "books" }] });
  }

  //  Update category
  static async updateCategory(category_id, data) {
    const category = await Category.findByPk(category_id);
    if (!category) return null;
    return await category.update(data);
  }

  //  Delete category
  static async deleteCategory(category_id) {
    const category = await Category.findByPk(category_id);
    if (!category) return null;
    await category.destroy();
    return category;
  }
}

module.exports = CategoryService;
