const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrow.controller");
const { authenticate } = require("../middlewares/auth.middleware");  


router.get("/", authenticate, borrowController.getAllBorrows);

// router.post("/borrows", authenticate, borrowController.borrowBook);
// router.get("/borrows", authenticate, borrowController.getBorrowedBooks);
// router.delete("/return/:id", authenticate, borrowController.returnBook);
 
module.exports = router;
