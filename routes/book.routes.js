const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");
const  bookSchema  = require("../validators/book.validation");
const validate = require("../middlewares/validateRequest");


// 🏷 Public Routes (User Access)
// router.get("/public", bookController.getAllBooks);
// router.get("/public/:book_id", bookController.getBookById);

router.get("/all",authenticateUser, bookController.getAllBooks);
router.get(
  "/recent-books",
  authenticateUser,
  bookController.getRecentlyAddedBooks
);
router.get("/:id",authenticateUser, bookController.getBookById);
router.post(
  "/",
  authenticateUser,
  authorizeAdmin,
  validate(bookSchema),
  bookController.createBook
); 
router.put("/:id", authenticateUser, authorizeAdmin, bookController.updateBook);
router.delete("/:id", authenticateUser, authorizeAdmin, bookController.deleteBook);

module.exports = router;
