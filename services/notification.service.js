const { Notification } = require("../models");

// Create a new notification
// exports.createNotification = async (user_id,book_id, message, notification_type) => {
//   return await Notification.create({ user_id, book_id,  message, notification_type }); 
// };






const moment = require("moment");

// Function to create a new notification
exports. createNotification = async (user_id, book_id, message, notification_type) => {
  try {
    return await Notification.create({ user_id, book_id, message, notification_type });
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    throw new Error("Failed to create notification");
  }
};

// Function to create a borrow notification
exports.createBorrowNotification = async (user_id, book_id, due_date) => {
  const formattedDueDate = moment(due_date).format("dddd, MMMM Do YYYY");
  const message = `📢 Reminder: Your borrowed book is due on ${formattedDueDate}. Please return it on time.`;

  return await createNotification(user_id, book_id, message, "borrow");
};

// Function to create a reservation notification
exports.createReservationNotification = async (user_id, book_id) => {
  const message = `📌 Your reservation for the book has been received. You will be notified when it's available.`;

  return await createNotification(user_id, book_id, message, "reservation");
};

// Function to notify the user when a book is available
exports.createAvailableNotification = async (user_id, book_id) => {
  const message = `✅ The book you reserved is now available for borrowing. Please collect it within 3 days.`;

  return await createNotification(user_id, book_id, message, "available");
};




// Get all notifications (for admin)
exports.getAllNotifications = async () => {
  return await Notification.findAll({ order: [["createdAt", "DESC"]] });
};

// Get notifications for a specific user
exports.getUserNotifications = async (user_id) => {
  return await Notification.findAll({
    where: { user_id },
    order: [["createdAt", "DESC"]],
  });
};

// Mark a notification as read
exports.markNotificationAsRead = async (notification_id) => {
  const notification = await Notification.findByPk(notification_id);
  if (!notification) throw new Error("Notification not found");

  await notification.update({ status: "read" });
  return notification;
};

// Delete a notification
exports.deleteNotification = async (notification_id) => {
  const notification = await Notification.findByPk(notification_id);
  if (!notification) throw new Error("Notification not found");

  await notification.destroy();
  return { message: "Notification deleted successfully" };
};
