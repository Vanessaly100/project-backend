const CategoryService = require("../services/categories.service");
const asyncHandler = require("express-async-handler");
const {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");

// Create Category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new BadRequestException("Category name is required");
  }

  const category = await CategoryService.createCategory({ name, description });
  res.status(201).json(category);
});

// Get All Categories (with pagination, filter, sorting)
exports.getAllCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "ASC",
    filter = "",
  } = req.query;

  const { totalCategories, Categories } =
    await CategoryService.getAllCategories({
      page,
      limit,
      sort,
      order,
      filter,
    });

  res.status(200).json({ totalCategories, Categories });
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
  const updatedCategory = await CategoryService.updateCategory(
    req.params.category_id,
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
    req.params.category_id
  );

  if (!deletedCategory) {
    throw new NotFoundException("Category not found");
  }

  res.status(200).json({ message: "Category deleted successfully" });
});
