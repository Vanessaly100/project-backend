"use strict";

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

    // Fetch real borrow IDs from BorrowedBooks table
    const borrows = await queryInterface.sequelize.query(
      `SELECT borrow_id FROM "Borrows";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || books.length === 0 || borrows.length === 0) {
      throw new Error(
        "Not enough users, books, or borrows found. Run all seeders first."
      );
    }

    // Helper functions
    const getRandomUser = () =>
      users[Math.floor(Math.random() * users.length)].user_id;
    const getRandomBook = () =>
      books[Math.floor(Math.random() * books.length)].book_id;
    const getRandomBorrow = () =>
      borrows[Math.floor(Math.random() * borrows.length)].borrow_id;

    const notifications = [
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        borrow_id: getRandomBorrow(), // Reference to actual borrowed book
        message: "Your reserved book is now available for pickup.",
        type: "Reservation",
        createdAt: new Date(),
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        borrow_id: getRandomBorrow(),
        message:
          "New books have been added to your favorite category: Science Fiction.",
        type: "Update",
        createdAt: new Date(),
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        borrow_id: getRandomBorrow(), // Reference to actual borrowed book
        message: "Reminder: Your borrowed book is due in 2 days.",
        type: "Reminder",
        createdAt: new Date(),
      },
      {
        notification_id: uuidv4(),
        user_id: getRandomUser(),
        book_id: getRandomBook(),
        borrow_id: getRandomBorrow(),
        message: "Your book review received a new reply.",
        type: "Review",
        createdAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Notifications", notifications);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Notifications", null, {});
  },
};
