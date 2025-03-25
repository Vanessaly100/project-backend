const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrow.controller");
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");

router.post("/:borrow_id", authenticate, authorizeAdminOrUser, borrowController.borrowBook);
router.get("/", authenticate, authorizeAdmin, authorizeAdmin, borrowController.getAllBorrows);
router.get("/:borrow_id",authorizeAdminOrUser, borrowController.getBorrowById);
router.put("/:borrowId/return", authenticate, authorizeAdmin, borrowController.returnBook);
router.get("/:userId/history", authenticate, authorizeAdminOrUser, borrowController.getUserBorrowHistory);
router.put("/:userId/history", authenticate, authorizeAdminOrUser, borrowController.updateBorrow);
router.delete("/:userId/history", authenticate, authorizeAdminOrUser, borrowController.deleteBorrow);

 
module.exports = router;
