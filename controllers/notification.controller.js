const { Notification } = require("../models");

//  Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({ where: { user_id } });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Create a new notification

exports.createNotification = async (req, res) => {
  try {
    const { user_id, message, notification_type } = req.body;

    const notification = await Notification.create({ user_id, message, notification_type });

    // Emit real-time notification
    const io = req.app.get("io"); // Get io instance from the app
    io.emit(`notification-${user_id}`, notification); // Send event to frontend

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findByPk(notification_id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ status: "read" });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findByPk(notification_id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
