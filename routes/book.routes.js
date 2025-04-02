const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");


// 🏷 Public Routes (User Access)
router.get("/public", bookController.getAllBooks);
router.get("/public/:book_id", bookController.getBookById);

router.get("/",authenticateUser, bookController.getAllBooks);
router.get("/:book_id",authenticateUser, bookController.getBookById);

//  Admin Routes (Only Admins Can Manage Books)
router.post("/", authenticateUser, authorizeAdmin, bookController.createBook);
router.put("/:book_id", authenticateUser, authorizeAdmin, bookController.updateBook);
router.delete("/:book_id", authenticateUser, authorizeAdmin, bookController.deleteBook);

module.exports = router;
