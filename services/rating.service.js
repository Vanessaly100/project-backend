const { BookRating, Book } = require("../models");

exports.createRating = async ({ user_id, book_id, rating, review }) => {
  const existing = await BookRating.findOne({ where: { user_id, book_id } });
  if (existing) {
    return await existing.update({ rating, review });
  }

  return await BookRating.create({ user_id, book_id, rating, review });
};

exports.getBookRatings = async (book_id) => {
  return await BookRating.findAll({
    where: { book_id },
    include: [{ association: "User", attributes: ["first_name", "last_name"] }],
    order: [["createdAt", "DESC"]],
  });
};

exports.getAverageRating = async (book_id) => {
  const ratings = await BookRating.findAll({ where: { book_id } });
  if (!ratings.length) return 0;

  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / ratings.length).toFixed(1);
};
