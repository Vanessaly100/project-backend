const { asyncWrapper } = require("../lib/utils");
const NotificationService = require("../services/notification.service");
const { sendNotification } = require("../lib/socket");
const {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");

// Get all notifications (admin)
exports.getAllNotifications = asyncWrapper(async (req, res) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    throw new InternalServerErrorException("Failed to fetch notifications");
  }
});

// Get notifications for a specific user
exports.getUserNotifications = asyncWrapper(async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await NotificationService.getUserNotifications(user_id);
    if (!notifications.length) {
      throw new NotFoundException("No notifications found for this user");
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error.message);
    throw new InternalServerErrorException("Failed to fetch user notifications");
  }
});

// Mark a notification as read
exports.markAsRead = asyncWrapper(async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await NotificationService.markNotificationAsRead(notification_id);
    if (!notification) {
      throw new NotFoundException("Notification not found");
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    throw new InternalServerErrorException("Failed to mark notification as read");
  }
});

// Mark all notifications as read for a user
exports.markAllUserNotificationsAsRead = asyncWrapper(async (req, res) => {
  try {
    const user_id = req.user.id;
    await NotificationService.markAllUserNotificationsAsRead(user_id);
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error.message);
    throw new InternalServerErrorException("Failed to mark all notifications as read");
  }
});

// Notification controller
exports.deleteNotification = asyncWrapper(async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Call the delete notification service
    const deleted = await NotificationService.deleteNotification(notification_id);

    if (!deleted) {
      // If no notification was deleted, throw a NotFoundException
      throw new NotFoundException("Notification not found");
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error.message);

    // Handle errors appropriately
    if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});


// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const { first_name, email, book_title, message, notification_type } = req.body;

    // Call service to create notification
    const notification = await NotificationService.createNotification(first_name, email, book_title, message, notification_type);

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Create an overdue notification
exports.createOverdueNotification = asyncWrapper(async (req, res) => {
  try {
    const { user_id, book_id, user_name, book_title, user_email } = req.body;
    if (!user_id || !book_id || !user_name || !book_title) {
      throw new BadRequestException("Missing required fields");
    }

    const notification = await NotificationService.createOverdueNotification(user_id, book_id, user_name, book_title, user_email);

    // Send WebSocket notification
    sendNotification(user_id, notification.message);

    res.status(201).json({ success: true, message: "Overdue notification sent", data: notification });
  } catch (error) {
    console.error("Error creating overdue notification:", error.message);
    throw new InternalServerErrorException("Failed to create overdue notification");
  }
});

// Create a borrow notification
exports.createBorrowNotification = asyncWrapper(async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    if (!user_id || !book_id || !due_date) {
      throw new BadRequestException("User ID, book ID, and due date are required");
    }

    const notification = await NotificationService.createBorrowNotification(user_id, book_id, due_date);

    // Send WebSocket notification
    sendNotification(user_id, `Your book (ID: ${book_id}) is due on ${due_date}.`);

    res.status(201).json({ success: true, message: "Borrow notification created", data: notification });
  } catch (error) {
    console.error("Error creating borrow notification:", error.message);
    throw new InternalServerErrorException("Failed to create borrow notification");
  }
});

// Create a reservation notification
exports.createReservationNotification = asyncWrapper(async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) {
      throw new BadRequestException("User ID and book ID are required");
    }

    const notification = await NotificationService.createReservationNotification(user_id, book_id);

    // Send WebSocket notification
    sendNotification(user_id, `Your reservation for book (ID: ${book_id}) is confirmed.`);

    res.status(201).json({ success: true, message: "Reservation notification created", data: notification });
  } catch (error) {
    console.error("Error creating reservation notification:", error.message);
    throw new InternalServerErrorException("Failed to create reservation notification");
  }
});

// Create an available notification
exports.createAvailableNotification = asyncWrapper(async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) {
      throw new BadRequestException("User ID and book ID are required");
    }

    const notification = await NotificationService.createAvailableNotification(user_id, book_id);

    // Send WebSocket notification
    sendNotification(user_id, `The book (ID: ${book_id}) you requested is now available.`);

    res.status(201).json({ success: true, message: "Available notification created", data: notification });
  } catch (error) {
    console.error("Error creating available notification:", error.message);
    throw new InternalServerErrorException("Failed to create available notification");
  }
});

// Send an overdue reminder
exports.sendOverdueReminder = asyncWrapper(async (req, res) => {
  try {
    const { borrowId } = req.params;
    if (!borrowId) {
      throw new BadRequestException("Borrow ID is required");
    }

    const result = await NotificationService.sendOverdueReminder(borrowId);

    if (!result.success) {
      throw new InternalServerErrorException(result.message);
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error("Error sending overdue reminder:", error.message);
    throw new InternalServerErrorException("Failed to send overdue reminder");
  }
});
