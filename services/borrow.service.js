const { Borrow, User, Book, Author, Reservation } = require("../models");
const { sequelize } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { sendEmail } = require("../lib/email");
const notificationService = require("../services/notification.service");
const { InternalServerErrorException } = require("../lib/errors.definitions");
const validator = require("validator");

exports.getAllBorrowedBooks = async ({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  filter = "",
  status = "",
}) => {

    const pageInt = parseInt(page, 10); // Convert to integer
    const limitInt = parseInt(limit, 10);
    const searchFilter = filter
      ? {
          [Op.or]: [
            Sequelize.where(Sequelize.col("user.first_name", "user.email"), {
              [Op.iLike]: `%${filter}%`,
            }),
            Sequelize.where(Sequelize.col("book.title"), {
              [Op.iLike]: `%${filter}%`,
            }),
          ],
        }
      : {};

    let statusFilter = {};
    if (status === "borrowed") {
      statusFilter.return_date = null;
    } else if (status === "overdue") {
      statusFilter.return_date = null;
      statusFilter.due_date = { [Op.lt]: new Date() };
    } else if (status === "returned") {
      statusFilter.return_date = { [Op.ne]: null };
    }

    // Merge both filters
    const whereClause = {
      ...searchFilter,
      ...statusFilter,
    };

    // --- Query borrows ---
    const borrows = await Borrow.findAndCountAll({
      where: whereClause,
      order: [
        [sort || "createdAt", order?.toUpperCase() === "DESC" ? "DESC" : "ASC"],
      ],
      limit: limitInt,
      offset: (pageInt - 1) * limitInt,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "first_name", "last_name", "email"],
        },
        {
          model: Book,
          as: "book",
          attributes: ["book_id", "title", "author_id"],
        },
      ],
    });

const totalPages = Math.ceil(borrows.count / limitInt);

return {
  borrows: borrows.rows,
  pagination: {
    totalItems: borrows.count,
    currentPage: pageInt,
    totalPages,
    pageSize: limitInt,
  },
};
};

exports.getBorrowById = async (borrow_id) => {
  const borrow = await Borrow.findByPk(borrow_id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["user_id", "first_name", "email"],
      },
      {
        model: Book,
        as: "book",
        attributes: ["book_id", "title", "author_id"],
      },
    ],
  });

  if (!borrow) throw new Error("Borrow record not found");
  return borrow;
};

exports.borrowBooks = async (user_id, bookIds) => {
  const transaction = await sequelize.transaction();
  const results = [];
  const today = new Date();
  const due_date = new Date(today);
  due_date.setDate(today.getDate() + 3);

  try {
    const user = await User.findByPk(user_id, { transaction });
    if (!user) throw new Error("User not found");

    for (const bookId of bookIds) {
      try {
        console.log("Processing book ID:", bookId);

        if (!validator.isUUID(bookId)) {
          results.push({
            bookId,
            success: false,
            message: "Invalid book ID format",
          });
          continue;
        }

        const book = await Book.findOne({
          where: { book_id: bookId },
          transaction,
        });
        if (!book) {
          results.push({
            bookId,
            success: false,
            message: "Book not found",
          });
          continue;
        }

        const alreadyBorrowed = await Borrow.findOne({
          where: {
            user_id,
            book_id: bookId,
            status: "borrowed", 
          },
          transaction,
        });

        if (alreadyBorrowed) {
          results.push({
            bookId: book.book_id,
            title: book.title,
            success: false,
            message: `You already borrowed "${book.title}" and haven't returned it.`,
          });
          continue;
        }

        if (book.available_copies <= 0) {
          results.push({
            bookId: book.book_id,
            title: book.title,
            success: false,
            message: `"${book.title}" is currently out of stock. Reserve to be notified when available.`,
          });
          continue;
        }

        // Create borrow record
        await Borrow.create(
          {
            user_id,
            book_id: book.book_id,
            due_date,
            status: "borrowed", 
          },
          { transaction }
        );

        // Update copies and user points
        await book.decrement("available_copies", { by: 1, transaction });
        await user.increment("points", { by: 1, transaction });

        if (user.points >= 100 && !user.rewarded) {
          await user.update({ rewarded: true }, { transaction });
        }

        // Notifications outside the transaction
        process.nextTick(async () => {
          try {
            await notificationService.createBorrowNotification(
              user.user_id,
              book.book_id,
              due_date
            );

            await sendEmail(
              user.email,
              "Book Borrowed Successfully",
              `You borrowed "${
                book.title
              }". Return by ${due_date.toDateString()}`
            );
          } catch (notifyErr) {
            console.error("Notification error:", notifyErr);
          }
        });

        results.push({
          bookId: book.book_id,
          title: book.title,
          success: true,
          message: `You successfully borrowed "${
            book.title
          }". Return by ${due_date.toDateString()}`,
        });
      } catch (bookErr) {
        console.error(`Error processing book ${bookId}:`, bookErr.message);
        results.push({
          bookId,
          success: false,
          message: `Error processing book: ${bookErr.message}`,
        });
      }
    }

    await transaction.commit();
    return {
      message: "Borrow process completed",
      results,
    };
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Borrowing failed:", err.message);
    throw new Error(err.message);
  }
};



exports.returnBook = async (user_id, book_id) => {
  try {
    // Find the borrow record for the given user and book
    const borrowRecord = await Borrow.findOne({
      where: {
        user_id,
        book_id,
        status: "borrowed", // Only return borrowed books
      },
    });

    if (!borrowRecord) {
      throw new Error("Borrow record not found or book not borrowed.");
    }

    // Update the borrow record to mark it as returned
    borrowRecord.status = "returned";
    borrowRecord.return_date = new Date();
    await borrowRecord.save();

    // Update the book's available copies
    const book = await Book.findByPk(book_id);
    if (book) {
      book.available_copies += 1;
      await book.save();
    }

    // Trigger notifications
    await notificationService.notifyBookReturned(
      borrowRecord.user_id,
      borrowRecord.book_id,
      borrowRecord.return_date
    );

    // Optionally, send a thank you email to the user
    const user = await User.findByPk(user_id);
    if (user) {
      await sendEmail(
        user.email,
        "Thank you for returning the book",
        `You have successfully returned the book.`
      );
    }

    return {
      success: true,
      message: "Book returned successfully and notifications sent.",
    };
  } catch (err) {
    console.error("Error in returning book:", err.message);
    throw new Error("Error in returning book: " + err.message);
  }
};
// Delete Borrow Record
exports.deleteBorrow = async (borrow_id) => {
  const borrow = await Borrow.findByPk(borrow_id);
  if (!borrow) throw new Error("Borrow record not found");

  await borrow.destroy();
  return { message: "Borrow record deleted successfully" };
};


// Update Borrow Record (Extend Due Date)
exports.updateBorrow = async (borrow_id, updatedData) => {
  const borrow = await Borrow.findByPk(borrow_id);
  if (!borrow) throw new Error("Borrow record not found");

  await borrow.update(updatedData);

  return borrow;
};


//================
exports.getActiveBorrows = async (user_id) => {
  return Borrow.findAll({
    where: {
      user_id,
      status: "borrowed",
    },
    include: [
      {
        model: Book,
        as: "book",
        attributes: ["book_id", "title", "author_id"],
      },
    ],
  });
};

const applyFilters = (query, filters, status) => {
  const {
    search,
    startBorrowDate,
    endBorrowDate,
    startDueDate,
    endDueDate,
    startReturnDate,
    endReturnDate,
  } = filters;

  if (search) {
    query.include[0].where = {
      ...query.include[0].where,
      title: { [Op.iLike]: `%${search}%` },
    };
  }

  if (status === "returned") {
    if (startReturnDate || endReturnDate) {
      query.where.return_date = {};
      if (startReturnDate)
        query.where.return_date[Op.gte] = new Date(startReturnDate);
      if (endReturnDate)
        query.where.return_date[Op.lte] = new Date(endReturnDate);
    }
  } else {
    if (startBorrowDate || endBorrowDate) {
      query.where.borrow_date = {};
      if (startBorrowDate)
        query.where.borrow_date[Op.gte] = new Date(startBorrowDate);
      if (endBorrowDate)
        query.where.borrow_date[Op.lte] = new Date(endBorrowDate);
    }

    if (startDueDate || endDueDate) {
      query.where.due_date = {};
      if (startDueDate) query.where.due_date[Op.gte] = new Date(startDueDate);
      if (endDueDate) query.where.due_date[Op.lte] = new Date(endDueDate);
    }
  }
};

const paginateAndSort = ({
  page = 1,
  limit = 5,
  sortBy = "borrow_date",
  order = "DESC",
}) => {
  const offset = (page - 1) * limit;
  return { offset, limit: parseInt(limit), order: [[sortBy, order]] };
};

exports.getFilteredBorrows = async (user_id, status, filters) => {
  const query = {
    where: { user_id, status },
    include: [{ model: Book, as: "book" }],
    distinct: true,
    ...paginateAndSort(filters),
  };

  applyFilters(query, filters, status);

  return Borrow.findAndCountAll(query);
};

exports.getReturnHistory = async (user_id, filters) => {
  const query = {
    where: { user_id, status: "returned" },
    include: [{ model: Book, as: "book" }],
    distinct: true,
    ...paginateAndSort(filters),
  };

  applyFilters(query, filters, "returned");

  return Borrow.findAndCountAll(query);
};
