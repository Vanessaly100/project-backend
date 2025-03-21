const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.Controller");

const router = express.Router();
const {authenticate,checkRole} = require("../middlewares/auth.middleware")

router.get("/",authenticate, getAllCategories);
router.get("/:category_id",authenticate, getCategoryById);
router.post("/", authenticate, checkRole(["admin"]), createCategory);
router.put("/:category_id",authenticate,checkRole(["admin"]), updateCategory);
router.delete("/:category_id",authenticate, checkRole(["admin"]), deleteCategory);

module.exports = router;
