const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");

// Get all notifications for a user (admin access)
router.get("/", authenticateUser, authorizeAdmin, NotificationController.getAllNotifications); 
// Get notifications for a specific user
router.get("/:user_id", authenticateUser, NotificationController.getUserNotifications);
// Mark a notification as read
router.patch("/mark/:notification_id", authenticateUser, NotificationController.markAsRead);
// Mark all notifications as read for a user
router.patch("/mark-all", authenticateUser, NotificationController.markAllUserNotificationsAsRead);
// Delete a notification
router.delete("/:notification_id", authenticateUser, NotificationController.deleteNotification);
// Create a general notification
router.post("/", authenticateUser, NotificationController.createNotification);
// Create borrow notification
router.post("/borrow", authenticateUser, NotificationController.createBorrowNotification);
// Create overdue notification
router.post("/create-overdue", authenticateUser, NotificationController.createOverdueNotification);
// Create reservation notification
router.post("/create-reservation", authenticateUser, NotificationController.createReservationNotification);
// Create available notification
router.post("/create-available", authenticateUser, NotificationController.createAvailableNotification);
// Send overdue reminder
router.post("/send-overdue-reminder/:borrowId", authenticateUser, NotificationController.sendOverdueReminder);

module.exports = router;
