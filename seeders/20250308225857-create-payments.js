'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Fetch actual user IDs from the Users table
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM "Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error("No users found. Make sure you run the Users seeder first.");
    }

    // Create payment records using real user IDs
    const payments = [
      {
        payment_id: uuidv4(),
        user_id: users[0].user_id, // Use real user ID
        amount: 25.99,
        payment_method: "Credit Card",
        status: "completed",
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        payment_id: uuidv4(),
        user_id: users[1].user_id,
        amount: 15.50,
        payment_method: "PayPal",
        status: "pending",
        transaction_date: new Date(new Date().setDate(new Date().getDate() - 3)),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        payment_id: uuidv4(),
        user_id: users[2].user_id,
        amount: 40.00,
        payment_method: "Debit Card",
        status: "failed",
        transaction_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Payments', payments);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Payments', null, {});
  }
};
