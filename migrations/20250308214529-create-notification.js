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
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
  type: Sequelize.ENUM("Review", "Reminder", "Update", "Reservation"),
  allowNull: false,
},
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Notifications");
  },
};
