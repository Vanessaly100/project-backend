const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");


// 🏷 Public Routes (User Access)
router.get("/public", bookController.getAllBooks);
router.get("/public/:book_id", bookController.getBookById);

router.get("/",authenticate, bookController.getAllBooks);
router.get("/:book_id",authenticate,authorizeAdminOrUser, bookController.getBookById);

//  Admin Routes (Only Admins Can Manage Books)
router.post("/", authenticate, authorizeAdmin, bookController.createBook);
router.put("/:book_id", authenticate, authorizeAdmin, bookController.updateBook);
router.delete("/:book_id", authenticate, authorizeAdmin, bookController.deleteBook);

module.exports = router;
