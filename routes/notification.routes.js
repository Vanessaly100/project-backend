const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// Get all notifications for a user
router.get("/:user_id", notificationController.getNotifications);

// Create a new notification
router.post("/", notificationController.createNotification);

// Mark notification as read
router.put("/:notification_id/read", notificationController.markAsRead);

// Delete a notification
router.delete("/:notification_id", notificationController.deleteNotification);

module.exports = router;
