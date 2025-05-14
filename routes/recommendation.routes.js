const express = require("express");
const recommendationController  = require("../controllers/recommendation.controller");
// const {
//   createRecommendation,
//   getAllRecommendations,
//   getRecommendationsByUser,
//   deleteRecommendation,
// } = require("../controllers/recommendation.controller");

const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");
router.get(
  "/user",
  authenticateUser,
  recommendationController.getRecommendations
);
module.exports = router;
