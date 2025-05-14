

const { Review, Book } = require("../models");

exports.addReview = async ({ user_id, book_id, rating, comment }) => {
  const review = await Review.create({ user_id, book_id, rating, comment });

  // Update average rating on book (optional)
  const allReviews = await Review.findAll({ where: { book_id } });
  const avgRating = (
    allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
  ).toFixed(1);

  await Book.update({ averageRating: avgRating }, { where: { book_id } });

  return review;
};

exports.getBookReviews = async (book_id) => {
  return Review.findAll({
    where: { book_id },
    include: ["User"],
    order: [["createdAt", "DESC"]],
  });
};
