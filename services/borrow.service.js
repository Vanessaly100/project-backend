const { Borrow, User, Book,Author, Reservation } = require("../models");
const { Op } = require("sequelize");
const { sendEmail } = require("../lib/email");
const notificationService = require("../services/notification.service");




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


exports.borrowBooks = async (user_id, bookIds) => {
  try {
    const results = [];

    const today = new Date();
    const due_date = new Date(today);
    due_date.setDate(today.getDate() + 7);

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    for (const bookId of bookIds) {
      const book = await Book.findByPk(bookId);

      if (!book) {
        results.push({
          bookId,
          success: false,
          message: `Book not found.`,
        });
        continue;
      }

      //  Check 1: Already borrowed and not returned
      const existingBorrow = await Borrow.findOne({
        where: {
          user_id,
          book_id: bookId,
          status: "Borrowed", // assuming "Borrowed" means not returned
        },
      });

      if (existingBorrow) {
        results.push({
          bookId,
          title: book.title,
          success: false,
          message: `You have already borrowed "${book.title}" and haven’t returned it yet.`,
        });
        continue;
      }

      // Check 2: No available copies
      if (book.available_copies <= 0) {
        results.push({
          bookId,
          title: book.title,
          success: false,
          message: `"${book.title}" is currently out of stock. Please wait while we restock.`,
        });
        continue;
      }

      //  Passed all checks – create borrow record
      await Borrow.create({
        user_id,
        book_id: bookId,
        due_date,
        status: "Borrowed",
      });

      // Decrease available copies
      book.available_copies -= 1;
      await book.save();

      // Add points
      user.points += 1;
      if (user.points >= 100 && !user.rewarded) {
        user.rewarded = true;
      }
      await user.save();

      //  Send notification
      await notificationService.createBorrowNotification({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        title: `You borrowed "${
          book.title
        }". Return by ${due_date.toDateString()}`,
      });

      // Send email
      await sendEmail(
        user.email,
        "Book Borrowed Successfully",
        `You borrowed "${book.title}". Return by ${due_date.toDateString()}`
      );

      results.push({
        bookId,
        title: book.title,
        success: true,
        message: `You successfully borrowed "${
          book.title
        }". Return by ${due_date.toDateString()}`,
      });
    }

    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};



// Return a Book
exports.returnBooks = async (user_id, bookIds) => {
  try {
    const results = [];

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    for (const book_id of bookIds) {
      const borrowRecord = await Borrow.findOne({
        where: {
          user_id,
          book_id,
          status: "Borrowed",
        },
      });

      if (!borrowRecord) {
        results.push({
          bookId: book_id,
          success: false,
          message: "No borrowed record found for this book.",
        });
        continue;
      }

      //  Mark as returned
      borrowRecord.status = "Returned";
      await borrowRecord.save();

      const book = await Book.findByPk(book_id);
      if (book) {
        book.available_copies += 1;
        await book.save();
      }

      //  Add result
      results.push({
        bookId: book_id,
        success: true,
        message: "Book returned successfully",
      });
    }

    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};



// services/borrowingService.js
exports.getBorrowedHistory = async (user_id) => {
  const history = await Borrow.findAll({
    where: { user_id },
    include: [
      {
        model: Book,
        as: "book", // Alias to reference the Book model
        attributes: ["title", "cover_url"], // Book's title and cover_url
        include: [
          {
            model: Author,
            as: "author", // Alias to include the Author model
            attributes: ["name"], // Fetch the author's name
          },
        ],
      },
      {
        model: User, // Include User model to fetch name/email
        as: "user",
        attributes: ["first_name", "last_name", "email"], // Or any other fields you want
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return history;
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


// Get User Borrow History
// exports.getUserBorrowHistory = async (user_id) => {
//   return await Borrow.findAll({
//     where: { user_id },
//     include: [{ model: Book, as: "book", attributes: ["book_id", "title"] }]
//   });
// };

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


