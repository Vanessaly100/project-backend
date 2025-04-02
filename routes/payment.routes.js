const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller"); // Ensure the path is correct
const { authenticateUser } = require("../middlewares/auth.middleware"); // Correctly import middleware

// Use functions correctly from paymentController
router.post("/pay", authenticateUser, paymentController.processPayment);
router.get("/history", authenticateUser, paymentController.getPaymentHistory);

module.exports = router;
