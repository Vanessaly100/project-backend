'use strict';
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Shares", {
      share_id: {
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
      platform: {
        type: Sequelize.ENUM("Facebook", "Twitter", "Instagram", "LinkedIn" , "WhatsApp"),
        allowNull: false,
      },
      shared_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      interaction_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("Shares");
  },
}; 
