const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrow.controller");
const { authenticateUser, authorizeAdmin, } = require("../middlewares/auth.middleware");

router.post("/:borrow_id", authenticateUser, borrowController.borrowBooks);
router.get("/borrowed-books", authenticateUser, authorizeAdmin, borrowController.getAllBorrows);

router.get("/:borrow_id", borrowController.getBorrowById);
router.put("/:borrowId/return", authenticateUser, authorizeAdmin, borrowController.returnBook);
router.get("/:userId/history", authenticateUser, borrowController.getUserBorrowHistory);
router.put("/:userId/history", authenticateUser, borrowController.updateBorrow);
router.delete("/:userId/history", authenticateUser, borrowController.deleteBorrow);

router.get("/books/:bookId/availability", authenticateUser, borrowController.checkBookAvailability);

router.post("/notify-users", authenticateUser, authorizeAdmin, borrowController.notifyUsers);

router.get("/overdue-books", borrowController.getOverdueBooks);


 
module.exports = router;



