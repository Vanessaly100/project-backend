const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticate, checkRole } = require("../middlewares/auth.middleware");

// 🏷 Public Routes (User Access)
router.get("/", bookController.getAllBooks);
router.get("/:book_id", bookController.getBookById);

//  Admin Routes (Only Admins Can Manage Books)
router.post("/", authenticate, checkRole(["admin"]), bookController.createBook);
router.put("/:book_id", authenticate, checkRole(["admin"]), bookController.updateBook);
router.delete("/:book_id", authenticate, checkRole(["admin"]), bookController.deleteBook);

module.exports = router;
