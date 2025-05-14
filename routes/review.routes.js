
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.post("/", authenticateUser, reviewController.addReview);
router.get("/:bookId", reviewController.getBookReviews);

module.exports = router;
