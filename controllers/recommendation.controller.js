const { Recommendation, User } = require("../models");
const { generateRecommendations } = require("../services/recommendation.service");


exports.createRecommendation = async (req, res) => {
  try {
    console.log("Received data:", req.body); 

    const { user_id, recommended_books, algorithm_used } = req.body;

    // Check if all fields are provided
    if (!user_id || !recommended_books || !algorithm_used) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRecommendation = await Recommendation.create({
      user_id,
      recommended_books,
      algorithm_used,
    });

    return res.status(201).json({ 
      message: "Recommendation created successfully!", 
      recommendation: newRecommendation 
    });

  } catch (error) {
    console.error("Error creating recommendation:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// Get all recommendations
exports.getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findAll({
      include: [{ model: User, attributes: ["first_name", "last_name", "email"] }],
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recommendations by user ID
exports.getRecommendationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const recommendations = await Recommendation.findAll({ where: { user_id } });

    if (!recommendations.length) return res.status(404).json({ error: "No recommendations found" });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Generate fresh recommendations (calls the service)
exports.getDynamicRecommendations = async (req, res) => {
  const { user_id } = req.params;
  try {
    const recommendations = await generateRecommendations(user_id);
    res.status(200).json({ user_id, recommendations });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

// Delete a recommendation
exports.deleteRecommendation = async (req, res) => {
  try {
    const { recommendation_id } = req.params;

    const recommendation = await Recommendation.findByPk(recommendation_id);
    if (!recommendation) return res.status(404).json({ error: "Recommendation not found" });

    await recommendation.destroy();
    res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
