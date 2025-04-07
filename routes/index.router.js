const express = require("express");
const authRoutes = require("../routes/auth.routes");
const authorRoutes = require("../routes/author.routes");
const bookRoutes = require("../routes/book.routes");
const cartRoutes = require("../routes/cart.routes");
const borrowRoutes = require("../routes/borrow.routes");
const paymentRoutes = require("../routes/payment.routes");
const userRoutes = require("../routes/user.routes");
const categoryRoutes = require("../routes/category.routes");
const recommendationRoutes = require("../routes/recommendation.routes");
const notificationRoutes = require("../routes/notification.routes");
const shareRoutes = require("../routes/share.routes");
const reservationRoutes = require("../routes/reservation.routes");
const  boroRoutes = require("../routes/boro");
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
router.use("/uploads", express.static("public/uploads")); // Serve images
router.use("/user", userRoutes);
router.use("/categories", categoryRoutes);

// Protected Routes (Authentication Required)
router.use("/cart", cartRoutes);
router.use("/borrowing",  borrowRoutes);
router.use("/payment", paymentRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/shares",  shareRoutes);
router.use("/reservations", reservationRoutes);
router.use("/borrow", boroRoutes);


router.all("*", function (req, res) {
  return res.status(404).json({
    success: false,
    message: `The requested route ${
      req.originalUrl
    } does not exist on this server or is not available for the ${req.method.toLowerCase()} method`,
  });
});


module.exports = router;