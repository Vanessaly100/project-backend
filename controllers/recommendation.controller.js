const asyncHandler = require("express-async-handler");
const RecommendationService = require("../services/recommendation.service");

exports.getRecommendations = asyncHandler(async (req, res) => {
  const recommendations =
    await RecommendationService.generateRecommendationsForUser(req.user.id);
  res.status(200).json({ success: true, data: recommendations });
});
