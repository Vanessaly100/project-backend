'use strict';

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

    // Create borrow records using real user and book IDs
    const borrows = [
      {
        borrow_id: uuidv4(),
        user_id: users[0].user_id,
        book_id: books[0].book_id,
        borrow_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)), // Due in 14 days
        return_date: null, // Not returned yet
        status: "borrowed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        borrow_id: uuidv4(),
        user_id: users[1].user_id,
        book_id: books[1].book_id,
        borrow_date: new Date(new Date().setDate(new Date().getDate() - 20)), // Borrowed 20 days ago
        due_date: new Date(new Date().setDate(new Date().getDate() - 6)), // Due 6 days ago
        return_date: null, // Not returned (overdue)
        status: "overdue",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        borrow_id: uuidv4(),
        user_id: users[2].user_id,
        book_id: books[2].book_id,
        borrow_date: new Date(new Date().setDate(new Date().getDate() - 30)), // Borrowed 30 days ago
        due_date: new Date(new Date().setDate(new Date().getDate() - 16)), // Due 16 days ago
        return_date: new Date(new Date().setDate(new Date().getDate() - 16)), // Returned on due date
        status: "returned",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Borrows', borrows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Borrows', null, {});
  }
};
