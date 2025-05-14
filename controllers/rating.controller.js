const asyncHandler = require("express-async-handler");
const RatingService = require("../services/rating.service");

exports.addRating = asyncHandler(async (req, res) => {
  const { book_id } = req.params;
  const { rating, review } = req.body;

  const result = await RatingService.createRating({
    user_id: req.user.id,
    book_id,
    rating,
    review,
  });

  res.status(201).json({ success: true, data: result });
});

exports.getRatings = asyncHandler(async (req, res) => {
  const { book_id } = req.params;
  const ratings = await RatingService.getBookRatings(book_id);
  const average = await RatingService.getAverageRating(book_id);

  res.status(200).json({ success: true, average, ratings });
});
