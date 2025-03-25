"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Borrows", {
      borrow_id: {
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
      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Books", key: "book_id" },
        onDelete: "CASCADE",
      },
      borrow_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      due_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
      status: {
        type: Sequelize.ENUM("borrowed", "returned", "overdue"),
        allowNull: false,
        defaultValue: "borrowed",
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
    await queryInterface.dropTable("Borrows");
  },
};
