const CategoryService = require("../services/categories.service");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await CategoryService.createCategory({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.category_id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryService.updateCategory(req.params.category_id, req.body);
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await CategoryService.deleteCategory(req.params.category_id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
