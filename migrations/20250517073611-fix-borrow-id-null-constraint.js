module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Notifications", "borrow_id", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Notifications", "borrow_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  }
};
