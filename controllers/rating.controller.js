const asyncHandler = require("express-async-handler");
const RatingService = require("../services/rating.service");
const { BookRating, Book } = require("../models");


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




// Utility to calculate average rating and update book
const updateBookAverageRating = async (book_id) => {
  const ratings = await BookRating.findAll({
    where: { book_id },
  });

  const avgRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  await Book.update({ avgRating }, { where: { book_id } });

  return avgRating;
};

// POST /api/ratings
exports.addOrUpdateRating = asyncHandler(async (req, res) => {
  const { book_id, rating, review } = req.body;
  console.log("Received request bodybbbbbbbbbbbbbbbb: ", req.body);

  const user_id = req.user.id; 
  console.log("User ID:", req.user?.id);


  if (!book_id || !rating) {
    return res.status(400).json({ message: "Book ID and rating are required" });
  }

  let ratingEntry = await BookRating.findOne({ where: { user_id, book_id } });

  if (ratingEntry) {

    ratingEntry.rating = rating;
    ratingEntry.review = review;
    await ratingEntry.save();
  } else {
    // Create new
    await BookRating.create({ book_id, user_id, rating, review });
  }

  const avgRating = await updateBookAverageRating(book_id);

  res.status(200).json({
    message: "Rating submitted",
    avgRating,
  });
});

exports.getUserRating = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { book_id } = req.params;

    const rating = await BookRating.findOne({
      where: { user_id, book_id },
    });

    res.json({ success: true, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching rating" });
  }
};
