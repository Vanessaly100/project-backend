'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Recommendations", {
      recommendation_id: {
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
      recommended_books: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
      },
      algorithm_used: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("Recommendations"); 
  },
};
