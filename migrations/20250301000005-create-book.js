module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Books", {
      book_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Categories", key: "category_id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Authors", key: "author_id" },
        onDelete: "CASCADE",
      },
      cover_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      publication_year: {
        type: Sequelize.INTEGER,
      },
      totalCopies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5, // Total number of copies for the book
      },

      available_copies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },

      borrowCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      avgRating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("Books");
  },
};
