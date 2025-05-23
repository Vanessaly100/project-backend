module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      membership_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "standard",
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      profile_picture_url: {
        type: Sequelize.STRING,
      },
      profilePicturePublicId: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      reading_preferences: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      rewarded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("Users");
  },
};
