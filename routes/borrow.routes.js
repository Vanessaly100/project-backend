const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrow.controller");
const { authenticateUser, authorizeAdmin, } = require("../middlewares/auth.middleware");

router.post("/", authenticateUser, borrowController.borrowBooks);
router.get("/borrowed-books", authenticateUser, authorizeAdmin, borrowController.getAllBorrows);
router.get("/history", authenticateUser, borrowController.getBorrowHistory);
router.put("/return", authenticateUser, borrowController.returnBooks);
router.get("/:borrow_id", borrowController.getBorrowById);




router.put("/:userId/history", authenticateUser, borrowController.updateBorrow);
router.delete("/:userId/history", authenticateUser, borrowController.deleteBorrow);

router.get("/books/:bookId/availability", authenticateUser, borrowController.checkBookAvailability);

router.post("/notify-users", authenticateUser, authorizeAdmin, borrowController.notifyUsers);

router.get("/overdue-books", borrowController.getOverdueBooks);

router.get("/user/:userId", authenticateUser, borrowController.getUserBorrows);

// In your routes.js
router.get("/my-borrows", authenticateUser, borrowController.getMyBorrows);
 
module.exports = router;



