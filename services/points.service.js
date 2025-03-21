const { User } = require("../models");

// Add points to a user
const addPoints = async (userId, points) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.points += points;
  await user.save();
  return user.points;
};

// Redeem points for benefits
const redeemPoints = async (userId, pointsToRedeem) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (user.points < pointsToRedeem) throw new Error("Not enough points");

  user.points -= pointsToRedeem;
  await user.save();
  return user.points;
};

module.exports = { addPoints, redeemPoints };
