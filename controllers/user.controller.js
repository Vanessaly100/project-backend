const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const userService = require("../services/user.service");
const pointsService = require("../services/points.service");



//  Fixing updateProfile
const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile function called"); // Debugging log
    const updatedUser = await userService.updateUserProfile(req.user.userId, req.body);

    if (!updatedUser || updatedUser.error) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Fixing changeMembership
const changeMembership = async (req, res) => {
  try {
    console.log("changeMembership function called"); // Debugging log
    const updatedUser = await userService.changeMembership(req.user.userId, req.body.membership_type);

    if (!updatedUser || updatedUser.error) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Membership updated successfully", updatedUser });
  } catch (error) {
    console.error("Membership update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    console.log("deleteUser function called"); // Debugging log
    const deleted = await userService.deleteUser(req.user.userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found or could not be deleted" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Award points for borrowing books
const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    // Logic to borrow book (handle in another service/controller)
    
    // Award points
    const newPoints = await pointsService.addPoints(userId, 10); // Example: 10 points per book

    res.json({ message: "Book borrowed successfully", points: newPoints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Redeem points
const redeemPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;

    const remainingPoints = await pointsService.redeemPoints(userId, points);

    res.json({ message: "Points redeemed successfully", remainingPoints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateProfile, changeMembership, deleteUser,redeemPoints,borrowBook };

