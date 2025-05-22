const express = require("express");
const {
  fetchAllCategoryNoLimit,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.Controller");

const router = express.Router();
const { authenticateUser, authorizeAdmin,} = require("../middlewares/auth.middleware");


router.get("/",authenticateUser, getAllCategories);
router.get("/no-filter-all", authenticateUser, fetchAllCategoryNoLimit);
router.get("/:id",authenticateUser, getCategoryById);
router.post("/", authenticateUser, authorizeAdmin, createCategory);
router.put("/:id",authenticateUser,authorizeAdmin, updateCategory);
router.delete("/:id",authenticateUser, authorizeAdmin, deleteCategory);

module.exports = router;
