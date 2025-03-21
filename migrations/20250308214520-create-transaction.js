'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transactions", {
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
        onDelete: "CASCADE",
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Payments", key: "payment_id" },
        onDelete: "CASCADE",
      },
      transaction_type: {
        type: Sequelize.ENUM("borrow", "purchase", "fine"),
        allowNull: false,
      },
      transaction_type: {
  type: Sequelize.STRING,  // Or ENUM if you have predefined types
  allowNull: false,  // This makes it required
},
      amount: {  // ✅ Added amount column
        type: Sequelize.FLOAT, 
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Transactions");
  },
};
