const borrowService = require("../services/borrow.service");

exports.borrowBooks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const { bookIds } = req.body; // Expect an array of book IDs

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: "Provide at least one book ID" });
    }

    const borrowedBooks = await borrowService.borrowBooks(userId, bookIds);
    res.status(201).json({ message: "Books borrowed successfully", borrowedBooks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { book_id } = req.body;

    if (!Array.isArray( book_id) ||  book_id.length === 0) {
      return res.status(400).json({ message: "Provide at least one book ID" });
    }

    const response = await borrowService.returnBooks(userId,  book_id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.notifyUsers = async (req, res) => {
  try {
    const notifiedUsers = await borrowService.notifyUsers();
    res.json({ message: "Users notified successfully", notifiedUsers });
  } catch (error) {
    res.status(500).json({ message: "Error sending notifications" });
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



exports.checkBookAvailability = async (req, res) => {
  try {
    const { bookId } = req.params;

    const borrowedBook = await db.Borrow.findOne({
      where: { bookId, status: "borrowed" },
    });

    if (borrowedBook) {
      return res.status(200).json({ message: "Book is currently borrowed" });
    }

    res.status(200).json({ message: "Book is available for borrowing" });
  } catch (error) {
    res.status(500).json({ message: "Error checking book availability" });
  }
};



exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Borrow.findAll({
      where: {
        dueDate: { [Op.lt]: new Date() }, // Past due date
        status: "borrowed",
      },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Book, attributes: ["id", "title"] },
      ],
      order: [["dueDate", "ASC"]],
    });

    res.json(overdueBooks);
  } catch (error) {
    console.error("Error fetching overdue books:", error);
    res.status(500).json({ message: "Failed to fetch overdue books" });
  }
};

