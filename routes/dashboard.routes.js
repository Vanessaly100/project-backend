const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/dasboard.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");


router.get("/", authenticateUser, adminDashboardController.getDashboardStats);
// Overview (counts)
router.get("/overview", authenticateUser, adminDashboardController.getOverview);

// Popular books
router.get(
  "/popular-books",
  authenticateUser,
  adminDashboardController.getPopularBooks
);

// Books with low available copies
router.get(
  "/low-stock-books",
  authenticateUser,
  adminDashboardController.getLowStockBooks
);

// Recent borrow/reservation activity
router.get(
  "/recent-activity",
  authenticateUser,
  adminDashboardController.getRecentActivity
);
router.get(
  "/all-recent-activity",
  authenticateUser,
  adminDashboardController.getAllRecentActivities
);

// Chart data (borrow counts)
router.get(
  "/reports/chart-data",
  authenticateUser,
  adminDashboardController.getChartData
);


module.exports = router;
