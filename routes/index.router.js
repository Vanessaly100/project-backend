const express = require("express");
const authRoutes = require("../routes/auth.routes");
const authorRoutes = require("../routes/author.routes");
const bookRoutes = require("../routes/book.routes");
const genreRoutes = require("../routes/genre.routes");
const borrowRoutes = require("../routes/borrow.routes");
const userRoutes = require("../routes/user.routes");
const categoryRoutes = require("../routes/category.routes");
const recommendationRoutes = require("../routes/recommendation.routes");
const notificationRoutes = require("../routes/notification.routes");
const reservationRoutes = require("../routes/reservation.routes");
const router = express.Router();



router.get("/health", function (req, res) {
  return res.status(200).json({
    success: true,
    message: "Server is healthy and ready to serve",
  });
} );

router.use("/authors", authorRoutes);
router.use("/auth", authRoutes);//registration and login
router.use("/books", bookRoutes);
router.use("/genres", genreRoutes);
router.use("/uploads", express.static("public/uploads")); // Serve images
router.use("/user", userRoutes);
router.use("/categories", categoryRoutes);

// Protected Routes (Authentication Required)
router.use("/borrowing",  borrowRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reservations", reservationRoutes);


router.all("*", function (req, res) {
  return res.status(404).json({
    success: false,
    message: `The requested route ${
      req.originalUrl
    } does not exist on this server or is not available for the ${req.method.toLowerCase()} method`,
  });
});


module.exports = router;