
const { Book, Borrow, User, Genre, Author } = require("../models");
const { Op } = require('sequelize');
const genre = require("../models/genre");

exports.generateRecommendationsForUser = async (userId, limit = 10) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // 1. Top borrowed books
  const topBooks = await Book.findAll({
    order: [["borrowCount", "DESC"]],
    limit: 10,
  });

  // 2. Recently added books
  const recentBooks = await Book.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });

  // 3. Recent year books (e.g., within 1 year from now)
  const currentYear = new Date().getFullYear();
  const recentYearBooks = await Book.findAll({
    where: {
      publication_year: {
        [Op.gte]: currentYear - 1,
      },
    },
    limit: 10,
    order: [["borrowCount", "DESC"]],
  });

  // 4. Books by the most borrowed book's author
  let authorBooks = [];
  if (topBooks.length && topBooks[0].author_id) {
    authorBooks = await Book.findAll({
      where: {
        author_id: topBooks[0].author_id,
      },
      include: {
        model: Author,
        as: "author",
        attributes: ["name"],
      },
      limit: 10,
    });
  }

  // 5. Books with the same genre as most popular book
  let genreBooks = [];
  if (topBooks.length) {
    const topBookWithGenres = await Book.findByPk(topBooks[0].book_id, {
      include: {
        model: Genre,
        as: "genres",
        attributes: ["genre_id", "name"],
        through: { attributes: [] },
      },
    });

    const genreId = topBookWithGenres?.Genres?.[0]?.genre_id;
    if (genreId) {
      genreBooks = await Book.findAll({
        include: {
          model: Genre,
          as: "genres",
          where: { genre_id: genreId },
          attributes: ["name"],
          through: { attributes: [] },
        },
        limit: 10,
      });
    }
  }

  // Combine all sources and remove duplicates
  const allRecommendations = [
    ...topBooks,
    ...recentBooks,
    ...recentYearBooks,
    ...authorBooks,
    ...genreBooks,
  ];

  const uniqueBooks = Array.from(
    new Set(allRecommendations.map((book) => book.book_id))
  ).map((id) => allRecommendations.find((book) => book.book_id === id));

  return uniqueBooks.slice(0, limit);
};