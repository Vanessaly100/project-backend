

const { Review, Book } = require("../models");
exports.addReview = async ({ user_id, book_id, rating, comment }) => {
  const review = await Review.create({ user_id, book_id, rating, comment });

  const allReviews = await Review.findAll({ where: { book_id } });
  const avgRating = Number(
    (
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
    ).toFixed(1)
  );

  await Book.update({ avgRating }, { where: { book_id } });
  const book = await Book.findByPk(book_id);
  console.log("Average Ratingvbhdhdj",book.avgRating); // Should show the new average

  return review;
};



  exports.getBookReviews = async (book_id) => {
    const allReviews = await Review.findAll({ where: { book_id } });
    const avgRating = Number(
      (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
    );
    
    const [rowsUpdated] = await Book.update({ avgRating }, { where: { book_id } });
    console.log(`Rows updated: ${rowsUpdated}`);
    const updatedBook = await Book.findByPk(book_id);
    console.log("Updated book avgRating:", updatedBook.avgRating);
    return Review;
};


