
'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Fetch real user IDs from Users table
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM "Users";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Fetch real book IDs from Books table
    const books = await queryInterface.sequelize.query(
      `SELECT book_id FROM "Books";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || books.length < 3) {
      throw new Error("Not enough users or books found. Run Users and Books seeders first.");
    }

    // Helper function to get 3 random book IDs formatted for PostgreSQL array
    const getRandomBooks = () => {
      const shuffled = [...books].sort(() => 0.5 - Math.random()).slice(0, 3);
      return `ARRAY['${shuffled[0].book_id}', '${shuffled[1].book_id}', '${shuffled[2].book_id}']::UUID[]`;
    };

    // Create recommendations using actual IDs
    const recommendations = [
      {
        recommendation_id: uuidv4(),
        user_id: users[0].user_id,
        recommended_books: queryInterface.sequelize.literal(
          `ARRAY['${books[0].book_id}', '${books[1].book_id}', '${books[2].book_id}']::UUID[]`
        ),
        algorithm_used: "Collaborative Filtering",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        recommendation_id: uuidv4(),
        user_id: users[1].user_id,
        recommended_books: queryInterface.sequelize.literal(
          `ARRAY['${books[3].book_id}', '${books[4].book_id}', '${books[5].book_id}']::UUID[]`
        ),
        algorithm_used: "Content-Based Filtering",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        recommendation_id: uuidv4(),
        user_id: users[2].user_id,
        recommended_books: queryInterface.sequelize.literal(getRandomBooks()),
        algorithm_used: "Hybrid Method",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Recommendations', recommendations);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Recommendations', null, {});
  }
};
