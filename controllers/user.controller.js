
const userService = require("../services/user.service");
const pointsService = require("../services/points.service");


//  Users can fetch their own details (by ID, name, or email)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.user_id); // Get logged-in user by ID
    if (!user) return res.status(404).json({ message: "User not found" });
     
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Admin & User: Fetch by ID, name, or email
exports.getUserByQuery = async (req, res) => {
  try {
    const { user_id, name, email } = req.query;
    const user = await userService.findUser({ user_id, name, email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // If user is not an admin, ensure they can only fetch their own details
    if (req.user.role !== "admin" && req.user.user_id !== user.user_id) {
      return res.status(403).json({ message: "Forbidden, you can only access your own details" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: Update user details
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.user_id, req.body);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // Assuming user ID is stored in req.user after authentication
    let updateData = req.body;

    // Check if a file is uploaded
    if (req.file) {
      updateData.profilePhoto = req.file.path; // Save file path or URL from Cloudinary
    }

    const isAdmin = req.user.role === "admin"; // Adjust this based on your role system

    const updatedUser = await userService.updateUserProfile(userId, updateData, isAdmin);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.user_id);
    if (!success) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};





//  Fixing changeMembership
exports.changeMembership = async (req, res) => {
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





// Award points for borrowing books
exports.borrowBook = async (req, res) => {
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
exports.redeemPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;

    const remainingPoints = await pointsService.redeemPoints(userId, points);

    res.json({ message: "Points redeemed successfully", remainingPoints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Reset Password Controller (Forgot Password)
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const result = await userService.resetUserPassword(email, newPassword);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ message: result.success });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Password Controller (Change Password)
exports.updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const result = await userService.updateUserPassword(userId, oldPassword, newPassword);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: result.success });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
