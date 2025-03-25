const { Borrow, User, Book, Reservation } = require("../models");
const { Op } = require("sequelize");
const { sendEmail } = require("../services/email.service");
const notificationService = require("../services/notification.service");

// Borrow a Book
exports.borrowBook = async (user_id, book_id, due_date) => {
  // Check if the user and book exist
  console.log("🔍 Checking user_id:", user_id);
  console.log("🔍 Checking book_id:", book_id);

  const user = await User.findByPk(user_id);
  const book = await Book.findByPk(book_id);

  console.log("👤 User found:", user);
  console.log("📚 Book found:", book);
  if (!user || !book) throw new Error("User or Book not found");

  // Check if the book is already borrowed
  const borrowedBook = await Borrow.findOne({ where: { book_id, status: "Borrowed" } });
  if (borrowedBook) throw new Error("Book is already borrowed");

  // Borrow the book
  const borrow = await Borrow.create({
    user_id,
    book_id,
    borrow_date: new Date(),
   due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
    status: "Borrowed",
  });

  // Mark book as unavailable
  await Book.update({ available: false }, { where: { book_id: book_id } });

  // Notify user
  await notificationService.createNotification(
    user_id,
    `You have successfully borrowed "${book.title}". Due on ${due_date}.`
  );

  // Send email notification
  await sendEmail(
    user.email,
    "Book Borrowed Successfully",
    `You have borrowed "${book.title}". Please return it before ${due_date}.`
  );

  return borrow;
};

// Return a Book
exports.returnBook = async (borrow_id) => {
  const borrow = await Borrow.findByPk(borrow_id);
  if (!borrow) throw new Error("Borrow record not found");

  // Mark as returned
  borrow.returnDate = new Date();
  borrow.status = "Returned";
  await borrow.save();

  // Mark book as available
  await Book.update({ available: true }, { where: { id: borrow.book_id } });

  // Check for reservations
  const reservation = await Reservation.findOne({ where: { book_id: borrow.book_id, status: "Pending" } });
  if (reservation) {
    await notificationService.createNotification(
      reservation.user_id,
      `The book you reserved "${borrow.book_id}" is now available.`
    );
    reservation.status = "Fulfilled";
    await reservation.save();
  }

  return borrow;
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
exports.getAllBorrows = async () => {
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
