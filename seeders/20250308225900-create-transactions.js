'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Fetch real user IDs from Users table
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM "Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Fetch real payment IDs from Payments table
    const payments = await queryInterface.sequelize.query(
      `SELECT payment_id FROM "Payments";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || payments.length === 0) {
      throw new Error("No users or payments found. Run Users and Payments seeders first.");
    }

    // Create transactions using actual IDs
    const transactions = [
      {
        transaction_id: uuidv4(),
        user_id: users[0].user_id, // Use actual user ID
        payment_id: payments[0].payment_id,
         transaction_type: "purchase", // Use actual payment ID
        amount: 19.99,
        status: "completed",
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transaction_id: uuidv4(),
        user_id: users[1].user_id,
        payment_id: payments[1].payment_id,
        amount: 9.99,
         transaction_type: "borrow",
        status: "pending",
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transaction_id: uuidv4(),
        user_id: users[2].user_id,
        payment_id: payments[2].payment_id,
         transaction_type: "fine",
        amount: 14.99,
        status: "failed",
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Transactions', transactions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
