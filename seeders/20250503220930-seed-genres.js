"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const uniqueGenres = [
      "Fantasy",
      "Romance",
      "Mystery",
      "Non-Fiction",
      "Thriller",
      "Science",
      "Fiction",
      "History",
    ];

    const genresData = uniqueGenres.map((name) => ({
      genre_id: uuidv4(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Genres", genresData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Genres", null, {});
  },
};
