const { asyncWrapper } = require("../lib/utils");
const asyncHandler = require("express-async-handler");
const NotificationService = require("../services/notification.service");
const { sendNotification } = require("../lib/socket");
const {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");
const { Notification, Borrow } = require("../models");


exports.getAllNotifications = asyncWrapper(async (req, res) => {
  const result = await NotificationService.getFilteredNotifications(req.query);

  res.status(200).json({
    notifications: result.notifications,
    pagination: result.pagination,
  });
});

// Get notifications for a specific user
exports.getUserNotifications = asyncWrapper(async (req, res) => {
  const user_id = req.user.id;
  const notifications = await NotificationService.getUserNotification(user_id);
  res.status(200).json(notifications);
});

// Get unread notification count for a user
exports.getUnreadNotificationCount = asyncWrapper(async (req, res) => {
  const user_id = req.user.id;
  const count = await NotificationService.getUnreadNotificationCount(user_id);
  res.status(200).json({ unreadCount: count });
});

// Mark a specific notification as read
exports.markAsRead = asyncWrapper(async (req, res) => {
  const { notification_id } = req.params;
  const notification = await NotificationService.markNotificationAsRead(
    notification_id
  );
  if (!notification) {
    throw new NotFoundException("Notification not found");
  }
  res.status(200).json(notification);
});

// Mark all notifications for a user as read
exports.markAllUserNotificationsAsRead = asyncWrapper(async (req, res) => {
  const user_id = req.user.id;
  await NotificationService.markAllUserNotificationsAsRead(user_id);
  res.status(200).json({ message: "All notifications marked as read" });
});

// Update a notification by ID
exports.updateNotification = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByPk(id);
  if (!notification) {
    throw new NotFoundException("Notification not found");
  }
  await notification.update(req.body);
  res.status(200).json({ message: "Notification updated", data: notification });
});

// Create a borrow notification
exports.createBorrowNotification = asyncWrapper(async (req, res) => {
  const { user_id, book_id, due_date } = req.body;
  if (!user_id || !book_id || !due_date) {
    throw new BadRequestException(
      "User ID, book ID, and due date are required"
    );
  }

  const notification = await NotificationService.createBorrowNotification(
    user_id,
    book_id,
    due_date
  );
  sendNotification(user_id, notification.message);

  res.status(201).json({
    success: true,
    message: "Borrow notification created",
    data: notification,
  });
});


exports.createNotification = asyncHandler(async (req, res) => {
  const notification = await NotificationService.createNotification(req.body);
  res.status(201).json({ success: true, data: notification });
});

//  Create notification for ALL users
exports.notifyAllUsers = asyncHandler(async (req, res) => {
  const notifications = await NotificationService.createNotificationForAllUsers(
    req.body
  );
  res.status(201).json({ success: true, data: notifications });
});

// Delete a notification by ID
exports.deleteNotification = asyncWrapper(async (req, res) => {
  const deleted = await NotificationService.deleteNotification(req.params.id);
  if (!deleted) {
    throw new NotFoundException(
      "Notification not found or could not be deleted"
    );
  }
  res.status(200).json({ message: "Notification deleted successfully" });
});

// Check and send notifications for upcoming due dates
exports.checkUpcomingDueDates = asyncWrapper(async (req, res) => {
  await NotificationService.checkUpcomingDueDates();
  res
    .status(200)
    .json({ message: "Upcoming due dates checked and notifications sent." });
});

// Check and send notifications for overdue borrows
exports.checkOverdueBorrows = asyncWrapper(async (req, res) => {
  await NotificationService.checkOverdueBorrows();
  res
    .status(200)
    .json({ message: "Overdue borrows checked and notifications sent." });
});

// Notify that a book has been returned
exports.notifyBookReturned = asyncWrapper(async (req, res) => {
  const { borrow_id } = req.body;
  const response = await NotificationService.notifyBookReturned(borrow_id);
  await Borrow.update({ return_date: new Date() }, { where: { borrow_id } });
  res.status(200).json(response);
});
