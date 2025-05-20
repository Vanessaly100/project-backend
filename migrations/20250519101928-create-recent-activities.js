
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("RecentActivities", {
      activity_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false, // e.g., "borrow", "return", "reserve", "rating", "newUser"
      },
      book_id: {
        type: Sequelize.UUID,
        allowNull: true, // nullable for things like "newUser"
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("RecentActivities");
  },
};
