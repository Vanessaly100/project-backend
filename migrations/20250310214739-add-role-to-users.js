'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user", // Default role is "user"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "role");
  },
};
