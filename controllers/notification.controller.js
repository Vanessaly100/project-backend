const notificationService = require("../services/notification.service");

// Get all notifications (for admin)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await notificationService.getUserNotifications(user_id);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await notificationService.markNotificationAsRead(notification_id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const response = await notificationService.deleteNotification(notification_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ==============================
// Controller to create a notification
exports.createNotification = async (req, res) => {
  try {
    const { user_id, book_id, message, notification_type } = req.body;
    const notification = await notificationService.createNotification(user_id, book_id, message, notification_type);
    res.status(201).json({ success: true, message: "Notification created", data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to create a borrow notification
exports.createBorrowNotification = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    const notification = await notificationService.createBorrowNotification(user_id, book_id, due_date);
    res.status(201).json({ success: true, message: "Borrow notification created", data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to create a reservation notification
exports.createReservationNotification = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    const notification = await notificationService.createReservationNotification(user_id, book_id);
    res.status(201).json({ success: true, message: "Reservation notification created", data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to create an available notification
exports.createAvailableNotification = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    const notification = await notificationService.createAvailableNotification(user_id, book_id);
    res.status(201).json({ success: true, message: "Available notification created", data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};