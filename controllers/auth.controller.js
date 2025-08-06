const {
  registerUser,
  registerAdmin,
  loginUser,
} = require("../services/auth.service");
const sendTokenResponse = require("../lib/sendToken");
const NotificationService = require("../services/notification.service");
const asyncHandler = require("express-async-handler");
 
// User Registration
const register = asyncHandler(async (req, res) => {
  const newUser = await registerUser(req.body);
  await NotificationService.notifyNewUserRegistration(newUser);
  sendTokenResponse(newUser, res, "User registered successfully");
});

// Admin Registration
const registerAdminController = asyncHandler(async (req, res) => {
  const newAdmin = await registerAdmin(req.body);
  sendTokenResponse(newAdmin, res, "Admin registered successfully");
});

// User Login
const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  sendTokenResponse(user, res, "Login successful");
});

// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  registerAdminController,
  login,
  logout,
};
