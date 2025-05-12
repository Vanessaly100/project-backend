'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Notifications", {
      notification_id: {
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
      borrow_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Borrows", key: "borrow_id" },
        onDelete: "CASCADE",
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
  type: Sequelize.ENUM("Review", "Borrow", "Return", "Overdue","Reminder", "Update", "Reservation","General"),
  allowNull: false,
},
      is_read: {
        type: Sequelize.ENUM("Unread", "Read"),
              defaultValue: "Unread",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), 
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Notifications");
  },
};
