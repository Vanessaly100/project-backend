const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {User} = require("../models"); // Import your User model

//  Get logged-in user details (persist login)
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["user_id", "role", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
