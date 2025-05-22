const CategoryService = require("../services/categories.service");
const asyncHandler = require("express-async-handler");
const {
  BadRequestException,
  NotFoundException,
} = require("../lib/errors.definitions");



exports.fetchAllCategoryNoLimit = asyncHandler(async (req, res) => {
  const categories = await CategoryService.getAllCategoryNoLimit();
  res.status(200).json({ categories });
});

// Create Category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new BadRequestException("Category name is required");
  }

  const category = await CategoryService.createCategory({ name, description });
  res.status(201).json(category);
});


exports.getAllCategories = asyncHandler(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);
  
      res.status(200).json({
        categories: result.categories,
        pagination: result.pagination,
      });
});

// Get Category by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryById(
    req.params.category_id
  );

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  res.status(200).json(category);
});

// Update Category
exports.updateCategory = asyncHandler(async (req, res) => {
  const updatedCategory = await CategoryService.updateCategoryById(
    req.params.id,
    req.body
  );
 
  if (!updatedCategory) {
    throw new NotFoundException("Category not found");
  }

  res.status(200).json(updatedCategory);
});



// Delete Category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const deletedCategory = await CategoryService.deleteCategory(
    req.params.id,
  ); 

  if (!deletedCategory) {
    throw new NotFoundException("Category not found");
  }

  res.status(200).json({ message: "Category deleted successfully" });
});
 