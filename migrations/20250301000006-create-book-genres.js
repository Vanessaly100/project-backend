module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BookGenres", {
      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Books",
          key: "book_id",
        },
        onDelete: "CASCADE",
      },
      genre_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Genres",
          key: "genre_id",
        },
        onDelete: "CASCADE",
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("BookGenres");
  },
};
