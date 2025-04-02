const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.Controller");

const router = express.Router();
const { authenticateUser, authorizeAdmin,} = require("../middlewares/auth.middleware");


router.get("/",authenticateUser, getAllCategories);
router.get("/:category_id",authenticateUser, getCategoryById);
router.post("/", authenticateUser, authorizeAdmin, createCategory);
router.put("/:category_id",authenticateUser,authorizeAdmin, updateCategory);
router.delete("/:category_id",authenticateUser, authorizeAdmin, deleteCategory);

module.exports = router;
