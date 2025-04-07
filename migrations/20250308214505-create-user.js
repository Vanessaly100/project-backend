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

      // wishlist: {
      //   type: Sequelize.ARRAY(Sequelize.UUID),
      // },
      // borrow_history: {
      //   type: Sequelize.ARRAY(Sequelize.UUID),
      // },
      
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
