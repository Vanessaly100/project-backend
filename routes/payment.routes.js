const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller"); // Ensure the path is correct
const { authenticate } = require("../middlewares/auth.middleware"); // Correctly import middleware

// Use functions correctly from paymentController
router.post("/pay", authenticate, paymentController.processPayment);
router.get("/history", authenticate, paymentController.getPaymentHistory);

module.exports = router;
