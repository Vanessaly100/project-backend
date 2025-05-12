const borrowService = require("../services/borrow.service");
const db = require("../models");
const { Borrow, User, Book } = db;
const { Op, Sequelize } = require("sequelize");
const notificationService = require("../services/notification.service");
const asyncHandler = require("express-async-handler");
const {
  ValidationException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");

exports.borrowBooks = asyncHandler(async (req, res) => {
  const user_id = req.user?.user_id || req.body.user_id;
  const { bookIds } = req.body;

  if (!user_id || !Array.isArray(bookIds) || bookIds.length === 0) {
    throw new ValidationException("User ID and bookIds array are required.");
  }

  const borrowResult = await borrowService.borrowBooks(user_id, bookIds);
  const allSuccessful = borrowResult.results.every((r) => r.success);

  res.status(allSuccessful ? 200 : 207).json({
    success: allSuccessful,
    message: allSuccessful
      ? "All books borrowed successfully"
      : "Some books failed to borrow",
    results: borrowResult,
  });
});

exports.returnBooks = asyncHandler(async (req, res) => {
  const { user_id, bookIds } = req.body;

  if (!user_id || !Array.isArray(bookIds) || bookIds.length === 0) {
    throw new ValidationException("user_id and bookIds array are required");
  }

  const user = await User.findByPk(user_id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const results = [];

  for (const book_id of bookIds) {
    const borrowRecord = await Borrow.findOne({
      where: {
        user_id,
        book_id,
        status: "borrowed",
      },
    });

    if (!borrowRecord) {
      results.push({
        bookId: book_id,
        success: false,
        message:
          "No borrowed record found for this book or book is already returned.",
      });
      continue;
    }

    borrowRecord.status = "returned";
    borrowRecord.return_date = new Date();
    await borrowRecord.save();

    const book = await Book.findByPk(book_id);
    if (book) {
      book.available_copies += 1;
      await book.save();
    }

    results.push({
      bookId: book_id,
      success: true,
      message: "Book returned successfully",
    });

    try {
      await notificationService.notifyBookReturned(borrowRecord.borrow_id);
    } catch (notifyErr) {
      console.error("Error in notifying book returned:", notifyErr);
    }
  }

  res.status(200).json({
    message: "Books returned successfully.",
    results,
  });
});

exports.updateBorrow = asyncHandler(async (req, res) => {
  const borrow = await borrowService.updateBorrow(req.params.id, req.body);
  if (!borrow) {
    throw new NotFoundException("Borrow record not found");
  }
  res.status(200).json(borrow);
});

exports.deleteBorrow = asyncHandler(async (req, res) => {
  const result = await borrowService.deleteBorrow(req.params.id);
  res.json(result);
});

exports.getAllBorrows = asyncHandler(async (req, res) => {
  const result = await borrowService.getAllBorrowedBooks(req.query);
    
      res.status(200).json({
        borrows: result.borrows,
        pagination: result.pagination,
      });
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryById(
    req.params.category_id
  );

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  res.status(200).json(category);
});

exports.getBorrowById = asyncHandler(async (req, res) => {
  const { borrow_id } = req.params;
  const borrow = await borrowService.getBorrowById(borrow_id);
  if (!borrow) {
    throw new NotFoundException("Borrow record not found");
  }
  res.status(200).json(borrow);
});

exports.checkBookAvailability = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const borrowedBook = await db.Borrow.findOne({
    where: { bookId, status: "borrowed" },
  });

  if (borrowedBook) {
    return res.status(200).json({ message: "Book is currently borrowed" });
  }

  res.status(200).json({ message: "Book is available for borrowing" });
});

exports.getOverdueBooks = asyncHandler(async (req, res) => {
  const overdueBooks = await Borrow.findAll({
    where: {
      due_date: { [Op.lt]: new Date() },
      status: "borrowed",
    },
    include: [
      { model: User, as: "user", attributes: ["user_id", "first_name", "email"] },
      { model: Book, as: "book", attributes: ["book_id", "title"] },
    ],
    order: [["due_date", "ASC"]],
  });

  res.status(200).json(overdueBooks);
});

exports.getUserBorrows = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const authenticatedUserId = req.user.id;

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
});



//====================================
exports.getActiveBorrows = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const result = await borrowService.getFilteredBorrows(user_id, "borrowed", req.query);
  res.status(200).json(result);
});

//  Overdue Borrows
exports.getOverdueBorrows = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const filters = { ...req.query };
  filters.startDueDate = filters.startDueDate || null;
  filters.endDueDate = new Date(); 

  const result = await borrowService.getFilteredBorrows(user_id, "borrowed", filters);
  res.status(200).json(result);
});

//  Return History
exports.getReturnHistory = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const result = await borrowService.getReturnHistory(user_id, req.query);
  res.status(200).json(result);
});