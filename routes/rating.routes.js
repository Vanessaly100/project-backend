const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.post("/:book_id", authenticateUser, ratingController.addRating);
router.get("/:book_id", ratingController.getRatings);

module.exports = router;
