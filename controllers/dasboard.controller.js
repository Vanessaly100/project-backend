
const asyncHandler = require("express-async-handler");
const AdminDashboardService = require("../services/dashboard.service");
// controllers/adminController.js
const { RecentActivity, User, Book } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await AdminDashboardService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
});


exports.getOverview = asyncHandler(async (req, res) => {
  const data = await AdminDashboardService.getOverview();
  res.status(200).json({ success: true, data });
});

exports.getPopularBooks = asyncHandler(async (req, res) => {
  const data = await AdminDashboardService.getPopularBooks();
  res.status(200).json({ success: true, data });
});

exports.getLowStockBooks = asyncHandler(async (req, res) => {
  const data = await AdminDashboardService.getLowStockBooks();
  res.status(200).json({ success: true, data });
});


exports.getRecentActivity = asyncHandler(async (req, res) => {
  const { page, limit, startDate, endDate, categoryId } = req.query;
  const data = await AdminDashboardService.getRecentActivity({
    page,
    limit,
    startDate,
    endDate,
    categoryId,
  });
  res.status(200).json({ success: true, data });
});
  

exports.getAllRecentActivities = async (req, res) => {
  try {
    let { type, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Convert to integers
    page = parseInt(page);
    limit = parseInt(limit);

    const filters = {};
    if (type) filters.type = type.toLowerCase();
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt[Op.gte] = new Date(startDate);
      if (endDate) filters.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await RecentActivity.findAndCountAll({
      where: filters,
      include: [
        { model: User, attributes: ["first_name", "last_name"] },
        { model: Book, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows.map((activity) => ({
        id: activity.activity_id,
        type: activity.type,
        book: activity.Book?.title || null,
        user: `${activity.User.first_name} ${activity.User.last_name}`,
        rating: activity.rating,
        createdAt: activity.createdAt,
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      perPage: limit,
      totalRecords: count,
    });
  } catch (err) {
    console.error("Error fetching activities", err);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
};



exports.getChartData = asyncHandler(async (req, res) => {
  const data = await AdminDashboardService.getChartData();
  res.status(200).json({ success: true, data });
});
