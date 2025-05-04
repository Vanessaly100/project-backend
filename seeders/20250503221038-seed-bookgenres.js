const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const books = await queryInterface.sequelize.query(
      'SELECT book_id FROM "Books"'
    );
    const genres = await queryInterface.sequelize.query(
      'SELECT genre_id FROM "Genres"'
    );

    const bookGenresData = books[0].map((book, index) => ({
      book_id: book.book_id,
      genre_id: genres[0][index % genres[0].length].genre_id, // Rotate genres across books
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("BookGenres", bookGenresData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BookGenres", null, {});
  },
};
