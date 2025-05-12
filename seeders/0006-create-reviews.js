const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Fetch actual user IDs from the Users table
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM "Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Fetch actual book IDs from the Books table
    const books = await queryInterface.sequelize.query(
      `SELECT book_id FROM "Books";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || books.length === 0) {
      throw new Error("No users or books found. Make sure you run the Users and Books seeders first.");
    }

    // Create reviews with real user and book IDs
    const reviews = [
      {
        review_id: uuidv4(),
        user_id: users[0].user_id,  // Use real user ID
        book_id: books[0].book_id,  // Use real book ID
        rating: 5,
        comment: "Absolutely loved this book! Highly recommend.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        review_id: uuidv4(),
        user_id: users[1].user_id,
        book_id: books[1].book_id,
        rating: 4,
        comment: "Great read, but a bit slow in the middle.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        review_id: uuidv4(),
        user_id: users[2].user_id,
        book_id: books[2].book_id,
        rating: 3,
        comment: "It was okay, not my favorite genre though.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Reviews', reviews);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
