
const adminService = require("../services/borrow.service");

// Get all borrowed books
exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await adminService.getAllBorrows();

    const formattedBorrows = borrows.map((borrow) => ({
      borrow_id: borrow.borrow_id,
      user_name: `${borrow.User.first_name} ${borrow.User.last_name}`,
      book_title: borrow.Book.title,
      borrow_date: borrow.borrow_date,
      return_date: borrow.return_date,
      status: borrow.status,
    }));

    res.json(formattedBorrows);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};