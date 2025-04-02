const { Borrow, User, Book, Reservation } = require("../models");
const { Op } = require("sequelize");
const { sendEmail } = require("../lib/email");
const notificationService = require("../services/notification.service");

// Borrow a Book
exports.borrowBooks = async (user_id, book_id) => {
  const borrowedBooks = [];
  const today = new Date();
  const due_date = new Date(today);
  due_date.setDate(today.getDate() + 14); // 2 weeks due date

  for (const bookId of book_id) {
    // Check if the book is already borrowed
    const existingBorrow = await Borrow.findOne({
      where: { bookId, status: "borrowed" },
    });

    if (existingBorrow) {
      throw new Error(`Book ID ${bookId} is already borrowed.`);
    }

    // Borrow book
    const borrow = await Borrow.create({ user_id, book_id, due_date });
    borrowedBooks.push(borrow);
  }

  // Mark book as unavailable
  await Book.update({ available: false }, { where: { book_id: book_id } });

  // Notify user
  await notificationService.createNotification(
    user_id,
    `You have successfully borrowed "${Book.title}". Due on ${due_date}.`
  );

  // Send email notification
  await sendEmail(
    User.email,
    "Book Borrowed Successfully",
    `You have borrowed "${Book.title}". Please return it before ${due_date}.`
  );

  return borrowedBooks;
};

// Return a Book
exports.returnBooks = async (user_id, book_id) => {
  for (const bookId of book_id) {
    const borrow = await Borrow.findOne({
      where: { user_id, book_id, status: "borrowed" },
    });

    if (!borrow) {
      throw new Error(`You have not borrowed book ID ${bookId}`);
    }

    // Mark as returned
    await borrow.update({ status: "returned", return_date: new Date() });
  }

  // return { message: "Books returned successfully" };

  // Mark book as available
  await Book.update({ available: true }, { where: { id: book_id } });

  // Check for reservations
  const reservation = await Reservation.findOne({ where: { book_id: book_id, status: "Pending" } });
  if (reservation) {
    await notificationService.createNotification(
      reservation.user_id,
      `The book you reserved "${book_id}" is now available.`
    );
    reservation.status = "Fulfilled";
    await reservation.save();
  }

  return returnBooks;
};

exports.notifyUsers = async () => {
  const overdueBooks = await db.Borrow.findAll({
    where: {
      dueDate: { [Op.lt]: new Date() }, // Books past due date
      status: "borrowed",
      notified: false,
    },
    include: [{ model: db.User, attributes: ["id", "email", "name"] }, { model: db.Book, attributes: ["id", "title"] }],
  });

  for (const borrow of overdueBooks) {
    const userId = borrow.User.id;
    const bookId = borrow.Book.id;
    const userName = borrow.User.name;
    const bookTitle = borrow.Book.title;

    const message = `Hello ${userName},\n\nYour borrowed book "${bookTitle}" is overdue. Please return it as soon as possible.\n\nThank you.`;

    // Use notification service instead of sendEmail
    await notificationService.createNotification(userId, bookId, message, "overdue");

    // Mark as notified to prevent duplicate notifications
    await borrow.update({ notified: true });
  }

  return overdueBooks;
};

// Update Borrow Record (Extend Due Date)
exports.updateBorrow = async (borrow_id, newDueDate) => {
  const borrow = await Borrow.findByPk(borrow_id);
  if (!borrow) throw new Error("Borrow record not found");

  borrow.due_date = newDueDate;
  await borrow.save();

  return borrow;
};

// Delete Borrow Record
exports.deleteBorrow = async (borrow_id) => {
  const borrow = await Borrow.findByPk(borrow_id);
  if (!borrow) throw new Error("Borrow record not found");

  await borrow.destroy();
  return { message: "Borrow record deleted successfully" };
};

// Get All Borrowed Books
exports.getAllBorrowedBooks = async () => {
  return await Borrow.findAll({
    include: [
      { model: User, as: "user", attributes: ["user_id", "first_name", "email"] },
      { model: Book, as: "book", attributes: ["book_id", "title", "author_id"] }
    ]
  });
};

exports.getBorrowById = async (borrow_id) => {
  const borrow = await Borrow.findByPk(borrow_id, {
    include: [
      { model: User, as: "user", attributes: ["user_id", "first_name", "email"] },
      { model: Book, as: "book", attributes: ["book_id", "title", "author_id"] }
    ]
  });

  if (!borrow) throw new Error("Borrow record not found");
  return borrow;
};
// Get User Borrow History
exports.getUserBorrowHistory = async (user_id) => {
  return await Borrow.findAll({
    where: { user_id },
    include: [{ model: Book, as: "book", attributes: ["book_id", "title"] }]
  });
};

// Check Overdue Books and Notify Users
exports.checkOverdueBooks = async () => {
  const today = new Date();

  const overdueBorrows = await Borrow.findAll({
    where: { due_date: { [Op.lt]: today }, status: "Borrowed" },
  });

  for (const borrow of overdueBorrows) {
    await notificationService.createNotification(
      borrow.user_id,
      `Your borrowed book "${borrow.book_id}" is overdue. Please return it immediately.`
    );

    borrow.status = "Overdue";
    await borrow.save();
  }
};


