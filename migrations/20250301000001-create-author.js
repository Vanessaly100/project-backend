module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Authors", {
      author_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
      },
       social_media: { type: Sequelize.STRING },
      contact: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, unique: true },
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
    await queryInterface.dropTable("Authors");
  },
};
