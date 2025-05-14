// const { Recommendation, Book, BorrowHistory, User } = require("../models");

// recommendation.service.js
const { Book, Borrow, User, Genre } = require("../models");
const { Op } = require('sequelize');
const genre = require("../models/genre");

exports.generateRecommendationsForUser = async (userId, limit = 10) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Get user's most borrowed genres or favorite genres (optional advanced logic)

  const topBooks = await Book.findAll({
    order: [["borrowCount", "DESC"]],
    limit,
  });

 
  const topBookWithGenres = await Book.findByPk(topBooks[0]?.id, {
    include: {
      model: Genre,
      attributes: ["genre_id", "name"],
      through: { attributes: [] }, 
    },
  });

  if (!topBookWithGenres || !topBookWithGenres.Genres?.length) {
    return []; 
  }

  // Use the first genre for example (or loop through if you want all)
  const genreId = topBookWithGenres.Genres[0].genre_id;

  // Step 2: Find books with the same genre
  const genreBooks = await Book.findAll({
    include: {
      model: Genre,
      where: { genre_id: genreId },
      attributes: ["name"],
      through: { attributes: [] },
    },
    limit,
  });

  // const topBook = await Book.findOne({
  //   where: { id: topBooks[0].id },
  //   include: {
  //     model: Author,
  //     attributes: ["author_id", "name"],
  //   },
  // });

  if (!topBooks) return [];

  const authorBooks = await Book.findAll({
    where: {
      author_id: topBooks.author_id,
    },
    include: {
      model: Author,
      attributes: ["name"],
    },
    limit,
  });

  // Merge and remove duplicates
  const allRecommendations = [...topBooks, ...genreBooks, ...authorBooks];
  const uniqueBooks = Array.from(
    new Set(allRecommendations.map((book) => book.id))
  ).map((id) => allRecommendations.find((book) => book.id === id));

  return uniqueBooks.slice(0, limit);
};