const express = require("express");
const { generateRecommendations } = require("../services/recommendation.service");
const {
  createRecommendation,
  getAllRecommendations,
  getRecommendationsByUser,
  deleteRecommendation,
} = require("../controllers/recommendation.controller");

const router = express.Router();

// router.post("/", createRecommendation);
// router.get("/", getAllRecommendations);
// router.get("/:user_id", getRecommendationsByUser);
// router.delete("/:recommendation_id", deleteRecommendation);

// Store & manage recommendations in the database
router.post("/", createRecommendation);
router.get("/", getAllRecommendations);
router.get("/stored/:user_id", getRecommendationsByUser); // Changed path to avoid conflict
router.delete("/:recommendation_id", deleteRecommendation);

// Generate recommendations dynamically (without storing them)
router.get("/dynamic/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const recommendations = await generateRecommendations(user_id);
    res.status(200).json({ user_id, recommendations });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});
module.exports = router;
