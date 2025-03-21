const { Payment } = require("../models");

// Process a new payment
const processPayment = async (userId, amount, method) => {
  return await Payment.create({ userId, amount, method });
};

// Get payment history for a user
const getPaymentHistory = async (userId) => {
  return await Payment.findAll({ where: { userId } });
};

module.exports = {
  processPayment,
  getPaymentHistory,
};
