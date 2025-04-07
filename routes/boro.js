const express = require("express");
const {getBorrowRequests, borrowBook, getUserBorrows, approveBorrow } = require("../controllers/boro.controller");
const {authenticateUser} = require("../middlewares/auth.middleware");
const router = express.Router();


router.get("/requests", authenticateUser, getBorrowRequests);

// User borrows a book (Pending status)
router.post("/:bookId", authenticateUser, borrowBook);

// Admin approves/rejects borrow request
router.put("/approve/:borrowId", authenticateUser, approveBorrow);

// Get user's borrowed books

module.exports = router;
