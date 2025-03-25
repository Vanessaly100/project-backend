const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.Controller");

const router = express.Router();
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");


router.get("/",authenticate,authorizeAdminOrUser, getAllCategories);
router.get("/:category_id",authenticate, authorizeAdminOrUser, getCategoryById);
router.post("/", authenticate, authorizeAdmin, createCategory);
router.put("/:category_id",authenticate,authorizeAdmin, updateCategory);
router.delete("/:category_id",authenticate, authorizeAdmin, deleteCategory);

module.exports = router;
