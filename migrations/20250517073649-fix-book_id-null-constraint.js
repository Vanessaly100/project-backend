module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Notifications", "book_id", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Notifications", "book_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
