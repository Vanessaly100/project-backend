const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

router.get(
  "/",
  authenticateUser,
  authorizeAdmin,
  NotificationController.getAllNotifications
);
router.post(
  "/single",
  authenticateUser,
  authorizeAdmin,
  NotificationController.createNotification
); // For individual user
router.post(
  "/all",
  authenticateUser,
  authorizeAdmin,
  NotificationController.notifyAllUsers
);
router.get(
  "/:id",
  authenticateUser, 
  NotificationController.getUserNotifications
);
router.get(
  "/unread/count/:notification_id",
  authenticateUser,
  NotificationController.getUnreadNotificationCount
);
router.put("/:id", authenticateUser, NotificationController.updateNotification);

router.patch(
  "/mark/:notification_id",
  authenticateUser,
  NotificationController.markAsRead
);
router.patch(
  "/mark-all",
  authenticateUser,
  NotificationController.markAllUserNotificationsAsRead
);

router.post(
  "/create",
  authenticateUser,
  authorizeAdmin,
  NotificationController.createNotification
);
router.delete(
  "/:id",
  authenticateUser,
  NotificationController.deleteNotification
);


//=================================================
// Admin-only route to trigger upcoming due date checks
router.post("/check-upcoming-due-dates", authenticateUser, authorizeAdmin, NotificationController.checkUpcomingDueDates);
router.post(
  "/check-overdue-borrows",
  authenticateUser,
  authorizeAdmin,
  NotificationController.checkOverdueBorrows
);
router.post(
  "/notify-book-returned",
  authenticateUser,
  authorizeAdmin,
  NotificationController.notifyBookReturned
);

module.exports = router;
