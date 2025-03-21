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

    const notifications = [
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        message: "Your reserved book is now available for pickup.",
        type: "Reservation",
        createdAt: new Date(),
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        message: "New books have been added to your favorite category: Science Fiction.",
        type: "Update",
        createdAt: new Date(),
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        message: "Reminder: Your borrowed book is due in 2 days.",
        type: "Reminder",
        createdAt: new Date(), 
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        message: "Your book review received a new reply.",
        type: "Review",
        createdAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert("Notifications", notifications);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Notifications", null, {});
  },
};
