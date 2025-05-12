'use strict';

const { v4: uuidv4 } = require("uuid");

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

    if (users.length === 0 || books.length === 0) {
      throw new Error("Not enough users or books found. Run Users and Books seeders first.");
    }

    // Helper function to get a random user ID
    const getRandomUser = () => users[Math.floor(Math.random() * users.length)].user_id;

    // Helper function to get a random book ID
    const getRandomBook = () => books[Math.floor(Math.random() * books.length)].book_id;

    const shares = [
      {
        share_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        platform: "Twitter",
        shared_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        share_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        platform: "Facebook",
        shared_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        share_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        platform: "LinkedIn",
        shared_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert("Shares", shares);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Shares", null, {});
  },
};
