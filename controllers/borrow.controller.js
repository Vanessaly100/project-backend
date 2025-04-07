const borrowService = require("../services/borrow.service");
const db = require("../models");
const { Borrow, User, Book } = db;



exports.borrowBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookIds } = req.body;

    if (!userId) return res.status(400).json({ message: "User not found" });
    if (!Array.isArray(bookIds) || bookIds.length === 0)
      return res.status(400).json({ message: "No book IDs provided" });

    const results = await borrowService.borrowBooks(userId, bookIds);

    res.status(200).json({ message: "Borrow process completed", results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



exports.returnBooks = async (req, res) => {
  const user_id = req.user.id;
  const { bookIds } = req.body;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res.status(400).json({ message: "Provide at least one book ID" });
  }

  try {
    const results = await borrowService.returnBooks(user_id, bookIds);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBorrowHistory = async (req, res) => {
  const user_id = req.user.id;

  try {
    const history = await borrowService.getBorrowedHistory(user_id);

    const formattedHistory = history.map((record) => ({
      borrowId: record.id,
      bookId: record.book_id,
      title: record.book?.title || "Unknown Title",
      author: record.book.author ? record.book.author.name : "Unknown Author", // Get the author's name
      coverImage: record.book?.cover_url || "default.jpg",
      status: record.status,
      borrowedAt: record.borrow_date,
      dueDate: record.due_date,
      returnedAt: record.status === "Returned" ? record.return_date : null,
    }));

    // Fetching user's name or email directly from the included User model
    const userName = `${history[0].user.first_name} ${history[0].user.email}`;
    res.json({
      success: true,
      user: {
        id: user_id,
        name: userName,
      },

      history: formattedHistory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

// exports.getUserBorrowHistory = async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const borrows = await borrowService.getUserBorrowHistory(user_id);
//     res.status(200).json(borrows);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



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




// Get user's borrowed books
// exports.getUserBorrows = async (req, res) => {
//   try {
    
//     const { userId } = req.params; // Get the userId from the URL params

//     const borrowedBooks = await Borrow.findAll({
//       where: { user_id: userId }, // Use the actual user_id, not the string "user"
//       include: [
//         { model: User, as: "user" }, // Use the alias 'user' here
//         { model: Book, as: "book" }, // Use the alias 'book' here
//       ],
//     });
// res.status(200).json(borrowedBooks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.getUserBorrows = async (req, res) => {
  try {
    // Get the userId from the URL params
    const { userId } = req.params;

    // Get the userId from the authenticated user (from your auth middleware)
    const authenticatedUserId = req.user.id; // Assuming your auth middleware adds user to req

    // Verify the requested userId matches the authenticated user
    if (userId !== authenticatedUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const borrowedBooks = await Borrow.findAll({
      where: { user_id: userId },
      include: [
        { model: User, as: "user" },
        { model: Book, as: "book" },
      ],
    });

    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// In your borrowController.js
exports.getMyBorrows = async (req, res) => {
  try {
    // Get userId from the authenticated user (added by your auth middleware)
    const userId = req.user.id;

    const borrowedBooks = await Borrow.findAll({
      where: { user_id: userId },
      include: [
        { model: User, as: "user" },
        { model: Book, as: "book" },
      ],
    });

    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

