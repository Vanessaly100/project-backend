const userService = require("../services/user.service");
const pointsService = require("../services/points.service");
const asyncHandler = require("express-async-handler");
const {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} = require("../lib/errors.definitions");

// Get User Profile by ID
exports.getUserProfileById = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserById(req.user.user_id);
  if (!user) throw new NotFoundException("User not found");
  res.json(user);
});

// Get All Users with pagination and filters
exports.getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
    
      res.status(200).json({
        users: result.users,
        pagination: result.pagination,
      });
});

// Get User by Query (e.g., user_id, name, or email)
exports.getUserByQuery = asyncHandler(async (req, res, next) => {
  const { user_id, name, email } = req.query;
  const user = await userService.findUser({ user_id, name, email });

  if (!user) throw new NotFoundException("User not found");

  if (req.user.role !== "admin" && req.user.user_id !== user.user_id) {
    throw new ForbiddenException(
      "Forbidden, you can only access your own details"
    );
  }

  res.json(user);
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  console.log("Received request for update-profile");
  console.log("User in request: ", req.user);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Parse reading_preferences string into array before building updateData
  if (req.body.reading_preferences) {
    if (typeof req.body.reading_preferences === "string") {
      try {
        req.body.reading_preferences = JSON.parse(req.body.reading_preferences);
      } catch (error) {
        req.body.reading_preferences = [];
      }
    }
  }

  const allowedFields = [
    "first_name",
    "last_name",
    "phone_number",
    "location",
    "email",
    "reading_preferences",
    "membership_type",
  ];

  // Build updateData dynamically, using parsed reading_preferences if applicable
  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Proceed to update user profile
  const updatedUser = await userService.updateUserProfile(
    req.user.id,
    updateData,
    req.file
  );

  console.log("Updated user: ", updatedUser);

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone_number: updatedUser.phone_number,
      email: updatedUser.email,
      membership_type: updatedUser.membership_type,
      points: updatedUser.points,
      rewarded: updatedUser.rewarded,
      profile_picture_url: updatedUser.profile_picture_url,
      profilePicturePublicId: updatedUser.profilePicturePublicId,
      location: updatedUser.location,
      reading_preferences: updatedUser.reading_preferences,
      role: updatedUser.role,
    },
  });
});



exports.adminUpdateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserByAdmin(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully by admin",
    updatedUser,
  });
});


exports.getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
console.log("User ID from request params: ", userId);
  const user = await userService.getUserDetailsById(userId);
  console.log("User details fetched: ", user);

  if (!user) throw new NotFoundException("User not found");

  res.status(200).json(user);
});

// Delete User
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const success = await userService.deleteUser(req.params.id);
  if (!success) throw new NotFoundException("User not found");
  res.json({ message: "User deleted successfully" });
});


// Change Membership
exports.changeMembership = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.changeMembership(
    req.user.userId,
    req.body.membership_type
  );

  if (!updatedUser || updatedUser.error) {
    throw new NotFoundException("User not found");
  }

  res
    .status(200)
    .json({ message: "Membership updated successfully", updatedUser });
});

// Redeem Points
exports.redeemPoints = asyncHandler(async (req, res, next) => {
  const { userId, points } = req.body;
  const remainingPoints = await pointsService.redeemPoints(userId, points);
  res.json({ message: "Points redeemed successfully", remainingPoints });
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const result = await userService.resetUserPassword(email, newPassword);

  if (result.error) throw new NotFoundException(result.error);

  res.json({ message: result.success });
});

// Update Password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  const result = await userService.updateUserPassword(
    userId,
    oldPassword,
    newPassword
  );
  if (result.error) throw new BadRequestException(result.error);

  res.json({ message: result.success });
});

// Get Profile (Current User)
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserProfile(req.user.id);
  res.json(user);
});

// Get Borrowed Books by User
exports.getUserBorrowedBooks = asyncHandler(async (req, res, next) => {
  const user_id = req.user.id;
  const borrowedBooks = await userService.getUserBorrowedBooks(user_id);

  if (borrowedBooks.length === 0)
    throw new NotFoundException("No borrowed books found.");

  res.json(borrowedBooks);
});
