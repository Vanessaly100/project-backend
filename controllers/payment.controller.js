const paymentService = require("../services/payment.service");

// Process a new payment
exports.processPayment = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const payment = await paymentService.processPayment(req.user.id, amount, method);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user's payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentHistory(req.user.id);
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
