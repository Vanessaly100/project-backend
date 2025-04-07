const { Notification, User, Book } = require("../models");
const moment = require("moment");
const {sendEmail} = require("../lib/email"); 


// Function to create a borrow notification
exports.createBorrowNotification = async (user_id, book_id, due_date) => {
  try {
    const user = await User.findByPk(user_id);
    const book = await Book.findByPk(book_id);
    if (!user || !book) throw new Error("User or Book not found");

    const formattedDueDate = moment(due_date).format("dddd, MMMM Do YYYY");
    const message = ` Reminder: Your borrowed book "${book.title}" is due on ${formattedDueDate}. Please return it on time.`;

    await Notification.create({ user_id, book_id, message, notification_type: "borrow" });

    await sendEmail(user.email, "Book Borrowing Reminder", message);

    console.log(` Borrow reminder sent to ${user.email}`);
  } catch (error) {
    console.error("Error creating borrow notification:", error.message);
  }
};


exports.createNotification = async (first_name, email, book_title, message, notification_type) => {
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
    notification_type,
  });

  // Send email notification
  if (user.email) {
    await sendEmail(user.email, "Library Notification", message);
  }

  return notification;
};

exports.createOverdueNotification = async (user_id, book_id) => {
  const user = await User.findByPk(user_id);
  const book = await Book.findByPk(book_id);

  if (!user || !book) throw new Error("User or Book not found");

  const message = `Dear ${user.name}, your borrowed book "${book.title}" is overdue. Please return it as soon as possible.`;

  const notification = await Notification.create({
    user_id,
    book_id,
    message,
    notification_type: "overdue",
  });

  // Send email if user has an email
  if (user.email) {
    await sendEmail(user.email, "Overdue Book Notice", message);
  }

  return notification;
};

exports.getAllNotifications = async () => {
  return await Notification.findAll({
    include: [{ model: User, as: "user", attributes: ["first_name", "email"] },{ model: Book, as: "book", attributes: ["title"] }],
    order: [["createdAt", "DESC"]],
  });
};

exports.getUserNotifications = async (user_id) => {
  return await Notification.findAll({
    where: { user_id },
    include: [{ model: Book, as: "book", attributes: ["title"] }],
    order: [["createdAt", "DESC"]],
  });
};

exports.markNotificationAsRead = async (notification_id) => {
  const notification = await Notification.findByPk(notification_id);
  if (!notification) throw new Error("Notification not found");

  notification.is_read = "Read";
  await notification.save();

  return notification;
};

exports.markAllUserNotificationsAsRead = async (user_id) => {
  await Notification.update({ is_read: true }, { where: { user_id } });
};

// Notification service
exports.deleteNotification = async (notification_id) => {
  // This returns the number of rows affected (deleted)
  const rowsDeleted = await Notification.destroy({
    where: { notification_id: notification_id },
  });

  return rowsDeleted > 0; // If rowsDeleted is greater than 0, the deletion was successful
};

