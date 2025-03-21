const { Recommendation, Book, BorrowHistory, User } = require("../models");

const generateRecommendations = async (userId) => {
  try {
    // Step 1: Get the books the user has borrowed
    const borrowedBooks = await BorrowHistory.findAll({
      where: { user_id: userId },
      attributes: ["book_id"],
    });

    if (borrowedBooks.length === 0) return [];

    const bookIds = borrowedBooks.map((b) => b.book_id);

    // Step 2: Find similar books based on genre
    const recommendedBooks = await Book.findAll({
      where: {
        genre: {
          [Op.in]: Sequelize.literal(
            `(SELECT genre FROM Books WHERE book_id IN (${bookIds.join(",")}))`
          ),
        },
        book_id: { [Op.notIn]: bookIds }, // Exclude books already read
      },
      attributes: ["book_id"],
      limit: 10,
    });

    const recommendedBookIds = recommendedBooks.map((b) => b.book_id);

    // Step 3: Save recommendations in the database
    await Recommendation.upsert({
      user_id: userId,
      recommended_books: recommendedBookIds,
      algorithm_used: "content-based",
    });

    return recommendedBookIds;
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

module.exports = { generateRecommendations };
