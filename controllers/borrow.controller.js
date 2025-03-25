const borrowService = require("../services/borrow.service");

exports.borrowBook = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    
    // Log the received IDs
    console.log("Borrow Request:", { user_id, book_id });

    // Call the borrow service
    const borrow = await borrowService.borrowBook(user_id, book_id, due_date);
    res.status(201).json({ message: "Book borrowed successfully", borrow });
  } catch (error) {
    console.error("Error borrowing book:", error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.returnBook = async (req, res) => {
  try {
    const { borrow_id } = req.params;
    const borrow = await borrowService.returnBook(borrow_id);
    res.status(200).json({ message: "Book returned successfully", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBorrow = async (req, res) => {
  try {
    const { borrow_id } = req.params;
    const { newDueDate } = req.body;
    const borrow = await borrowService.updateBorrow(borrow_id, newDueDate);
    res.status(200).json({ message: "Borrow record updated", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBorrow = async (req, res) => {
  try {
    const { borrow_id } = req.params;
    await borrowService.deleteBorrow(borrow_id);
    res.status(200).json({ message: "Borrow record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await borrowService.getAllBorrows();
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBorrowById = async (req, res) => {
  try {
    const { borrow_id } = req.params;
    const borrow = await borrowService.getBorrowById(borrow_id);
    res.status(200).json(borrow);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getUserBorrowHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const borrows = await borrowService.getUserBorrowHistory(user_id);
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
