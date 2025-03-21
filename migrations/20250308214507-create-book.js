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
        type: Sequelize.STRING, // ✅ Add this line
        allowNull: true, // ✅ Allow it to be null in case some books don’t have images
      },
      genre: {
        type: Sequelize.STRING,
      },
      publication_year: {
        type: Sequelize.INTEGER,
      },
      available_copies: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
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
