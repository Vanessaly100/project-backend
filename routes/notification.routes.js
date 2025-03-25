const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");


// Get all notifications for a user 
router.get("/",authenticate, notificationController.getAllNotifications);
router.get("/:user_id", authenticate, notificationController.getUserNotifications);

router.post("/", authenticate, notificationController.createNotification);
router.post("/borrow", authenticate, notificationController.createBorrowNotification);
router.post("/reservation", authenticate, notificationController.createReservationNotification);
router.post("/available", authenticate, notificationController.createAvailableNotification);

// Mark notification as read
router.put("/:notification_id/read", authenticate, notificationController.markAsRead);

// Delete a notification
router.delete("/:notification_id", authenticate, notificationController.deleteNotification);

module.exports = router;
