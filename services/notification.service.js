const { Notification, User, Book, Borrow } = require("../models");
const moment = require("moment");
const {sendEmail} = require("../lib/email");
const { Op } = require("sequelize"); 
const { sendNotification } = require("../lib/socket");
const {
 InternalServerErrorException
} = require("../lib/errors.definitions");


// Function to create a borrow notification
exports.createBorrowNotification = async (user_id, book_id, due_date) => {
    const user = await User.findByPk(user_id);
    const book = await Book.findByPk(book_id);
    if (!user || !book) throw new Error("User or Book not found");

    const formattedDueDate = moment(due_date).format("dddd, MMMM Do YYYY");
    const message = `Reminder:${user.first_name} Your borrowed book "${book.title}" is due on ${formattedDueDate}. Please return it on time.`;

    const newNotification = await Notification.create({
      user_id,
      book_id,
      message,
      type: "Borrow",
    });

    // Refetch with user info
    const notificationWithUser = await Notification.findByPk(
      newNotification.notification_id,
      {
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "first_name",
              "last_name",
              "email",
              "profile_picture_url",
            ],
          },
        ],
      }
    );
    console.log("Notification with user:", notificationWithUser.toJSON());

 await sendEmail(user.email, "Book Borrowing Reminder", message);
 console.log(`Borrow reminder sent to ${user.email}`);
    return notificationWithUser;
};


exports.getFilteredNotifications = async (query) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "ASC",
    filter = "",
  } = query;

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  const result = await Notification.findAndCountAll({
    where: {
      [Op.or]: [
        { "$user.first_name$": { [Op.iLike]: `%${filter}%` } },
        { "$user.email$": { [Op.iLike]: `%${filter}%` } },
        { "$book.title$": { [Op.iLike]: `%${filter}%` } },
        // { "$type$": { [Op.iLike]: `%${filter}%` } },
      ],
    },
    include: [
      { model: Book, as: "book", attributes: ["title"] },
      {
        model: User,
        as: "user",
        attributes: ["first_name", "last_name", "email", "profile_picture_url"],
      },
    ],
    order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    limit: limitInt,
    offset: (pageInt - 1) * limitInt,
  });

  const totalPages = Math.ceil(result.count / limitInt);

  return {
    notifications: result.rows,
    pagination: {
      totalItems: result.count,
      currentPage: pageInt,
      totalPages,
      pageSize: limitInt,
    },
  };
};

exports.getUserNotification = async (user_id) => {
  return await Notification.findAll({
    where: { user_id },
    include: [{ model: Book, as: "book", attributes: ["title"] },{model: User, as: "user", attributes: ["first_name", "last_name", "email", "profile_picture_url"]},],
    order: [["createdAt", "DESC"]],
  });
};

exports.getUnreadNotificationCount = async (user_id) => {
  const count = await Notification.count({
    where: {
      user_id,
      is_read: "Unread",
    },
  });

  return count;
};


exports.markNotificationAsRead = async (notification_id) => {
  const notification = await Notification.findByPk(notification_id);

  if (!notification) return null;

  notification.is_read = "Read";
  await notification.save();

  return notification;
};

exports.markAllUserNotificationsAsRead = async (user_id) => {
  const markAllNotification = await Notification.update(
    { is_read: "Read" },
    {
      where: {
        user_id,
        is_read: "Unread",
      },
    }
  );
  return markAllNotification;
};

// Notification service
exports.deleteNotification = async (notification_id) => {
  const deleted = await Notification.destroy({
    where: { notification_id }, 
  });

  if (!deleted) {
    console.error("Notification not found:", notification_id);
    throw new Error("Notification not found");
  }

  console.log("Notification deleted successfully");
  return { message: "Notification deleted successfully" };
};


exports.createNotification = async (
  first_name,
  email,
  book_title,
  message,
  type
) => {
  // Find user by first_name and email
  const user = await User.findOne({
    where: { first_name, email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find book by title
  const book = await Book.findOne({
    where: { title: book_title },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  // Create notification with retrieved IDs
  const notification = await Notification.create({
    user_id: user.user_id,
    book_id: book.book_id,
    message,
    type,
  });

  // Send email notification
  if (user.email) {
    await sendEmail(user.email, "Library Notification", message);
  }

  return notification;
};

// Create Review Notification
exports.createReviewNotification = async (user_id, book_id) => {
  const message = `You have received a new reply on your book review.`;
  const notification = await Notification.create({
    user_id,
    book_id,
    type: 'Review',
    message,
  });
  return notification;
};

// Create Reservation Notification
exports.createReservationNotification = async (user_id, book_id) => {
  const message = `Your reservation for the book is now available for pickup.`;
  const notification = await Notification.create({
    user_id,
    book_id,
    type: 'Reservation',
    message,
  });
  return notification;
};

exports.createGeneralNotification = async (message) => {
  const users = await User.findAll();
  const notifications = [];
  for (const user of users) {
    const notification = await Notification.create({
      user_id: user.user_id,
      type: "General",
      message: message,
    });
    notifications.push(notification);
    sendNotification(user.user_id, message);
  }

  return notifications; 
};



//================================================================

exports.checkUpcomingDueDates = async () => {
  const today = new Date();
  const upcomingDate = new Date();
  upcomingDate.setDate(today.getDate() + 3);

  const upcomingBorrows = await Borrow.findAll({
    where: {
      return_date: null,
      due_date: {
        [Op.between]: [today, upcomingDate],
      },
    },
    include: [
      { model: User, as: "user", attributes: ["user_id", "first_name", "email", "role"] },
      { model: Book, as: "book", attributes: ["title"] },
    ],
  });

  const adminUsers = await User.findAll({ where: { role: "admin" } });

  for (const borrow of upcomingBorrows) {
    const user = borrow.user; 
    const book = borrow.book;

    if (!user || !book) {
      console.warn("Missing user or book in borrow record:", borrow);
      continue; 
    }

    const daysLeft = Math.ceil(
      (borrow.due_date - today) / (1000 * 60 * 60 * 24)
    );

    const adminMessage = `User ${user.first_name}'s borrow period for "${book.title}" ends in ${daysLeft} day(s).`;

    for (const admin of adminUsers) {
      try {
        await Notification.create({
          user_id: admin.user_id,
          book_id: book.book_id, 
          borrow_id: borrow.borrow_id, 
          message: adminMessage,
          type: "Reminder",
          is_read: "Unread",
        });
        sendNotification(admin.user_id, adminMessage);
      } catch (err) {
        console.error("Failed to create admin notification:", err.message);
      }
    }

    // Notify user
    const userMessage = `Reminder: Your borrow period for "${book.title}" ends in ${daysLeft} day(s).`;
    try {
      await Notification.create({
        user_id: user.user_id,
        book_id: book.book_id,
        borrow_id: borrow.borrow_id,
        message: userMessage,
        type: "Reminder", 
        is_read: "Unread",
      });
      sendNotification(user.user_id, userMessage);
    } catch (err) {
      console.error("Failed to create user notification:", err.message);
    }
  }

}

exports.checkOverdueBorrows = async () => {
  const today = new Date();

  const overdueBorrows = await Borrow.findAll({
    where: {
      return_date: null,
      due_date: { [Op.lt]: today },
    },
    include: [
      { model: User, as: "user", attributes: ["user_id", "first_name"] },
      { model: Book, as: "book", attributes: ["book_id", "title"] },
    ],
  });

  const adminUsers = await User.findAll({ where: { role: "admin" } });

  for (const borrow of overdueBorrows) {
    const message = `Overdue: ${borrow.user?.first_name} has not returned "${borrow.book?.title}".`;

    // Notify admins
    for (const admin of adminUsers) {
      try {
        await Notification.create({
          user_id: admin.user_id,
          book_id: borrow.book_id,
          borrow_id: borrow.borrow_id,
          message,
          type: "Overdue",
          is_read: "Unread",
        });

        sendNotification(admin.user_id, message);
      } catch (err) {
        console.error(
          "Failed to create overdue admin notification:",
          err.message
        );
      }
    }

    // Notify user
    const userMessage = `Reminder: ${borrow.user?.first_name} Your borrowed book "${borrow.book?.title}" is overdue. Please return it.`;

    try {
      await Notification.create({
        user_id: borrow.user_id,
        book_id: borrow.book_id,
        borrow_id: borrow.borrow_id,
        message: userMessage,
        type: "Overdue",
        is_read: "Unread",
      });

      sendNotification(borrow.user_id, userMessage);
    } catch (err) {
      console.error("Failed to create overdue user notification:", err.message);
    }
  }
};


exports.notifyBookReturned = async (borrow_id) => {
  try {
    const borrowRecord = await Borrow.findOne({
      where: { borrow_id, return_date: { [Op.ne]: null } },
      include: [
        { model: User, as: "user", attributes: ["user_id", "first_name"] },
        { model: Book, as: "book", attributes: ["book_id", "title"] },
      ],
    });

    if (!borrowRecord) {
      throw new Error("Borrow record not found or not returned yet.");
    }
     const { user, book, return_date } = borrowRecord;

    const userMessage = `Thank you for returning "${borrowRecord.book.title}"! We hope you enjoyed reading it.`;
    const adminMessage = `User ${borrowRecord.user.first_name} has returned the book "${borrowRecord.book.title}".`;

    // Notify the user
    await Notification.create({
      user_id: borrowRecord.user.user_id,
      book_id: borrowRecord.book.book_id,
      borrow_id: borrowRecord.borrow_id,
      message: userMessage,
      type: "Return",
      is_read: "Unread",
    });

    // Notify admins
    const adminUsers = await User.findAll({ where: { role: "admin" } });
    for (const admin of adminUsers) {
      await Notification.create({
        user_id: admin.user_id,
        book_id: borrowRecord.book.book_id,
        borrow_id: borrowRecord.borrow_id,
        message: adminMessage,
        type: "Return",
        is_read: "Unread",
      });

      sendNotification(admin.user_id, adminMessage);
    }

    sendNotification(borrowRecord.user.user_id, userMessage);
    return {
      message:
        "Thank you message sent to user and notification sent to admins.",
    };
  } catch (error) {
    console.error("Error in notifying book returned:", error);
    throw new Error("Internal server error.");
  }
};


exports.notifyNewUserRegistration = async (user) => {
  if (!user) throw new Error("User data is required");

  const admins = await User.findAll({ where: { role: "admin" } });

  for (const admin of admins) {
    const adminNotification = await Notification.create({
      user_id: admin.user_id,
      type: "Update",
      message: `New user registered: ${user.first_name} ${user.last_name}`,
      role: "admin",
    });

    sendNotification(admin.user_id, adminNotification);
  }

  // Notify User
  const userNotification = await Notification.create({
    user_id: user.user_id,
    type: "Update",
    message: `Welcome ${user.first_name}! Your account has been created.`,
    role: "user",
  });

  // Emit via Socket.IO
  sendNotification(user.user_id, userNotification); 
};
