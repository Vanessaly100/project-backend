
const asyncHandler = require("express-async-handler");
const reviewService = require("../services/review.service");

exports.addReview = asyncHandler(async (req, res) => {
  const { book_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!book_id || !rating) {
    return res.status(400).json({ message: "Book ID and rating are required" });
  }

  const review = await reviewService.addReview({
    user_id,
    book_id,
    rating,
    comment,
  });
  res.status(201).json({ success: true, data: review });
});

exports.getBookReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const reviews = await reviewService.getBookReviews(bookId);
  res.status(200).json({ success: true, data: reviews });
});
