const bcrypt = require("bcryptjs");

const { User } = require("../models");
const { Borrow, Book, Author } = require("../models");

//  Hash Password Function
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.updateUserProfile = async (user_id, updateData, isAdmin) => {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error("User not found");

  // If profilePhoto is passed, map it to the DB field
  if (updateData.profilePhoto) {
    updateData.profile_picture_url = updateData.profilePhoto;
    delete updateData.profilePhoto;
  }

  // Restrict non-admins from editing sensitive fields
  if (!isAdmin) {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "location",
      "reading_preferences",
      "profile_picture_url",
    ];
    Object.keys(updateData).forEach((key) => {
      if (!allowedFields.includes(key)) delete updateData[key];
    });
  }

  await user.update(updateData);
  return user;
};
 

// Fetch user by ID
exports.getUserById = async (user_id) => {
  return await User.findByPk(user_id);
};

//  Fetch user by name, email, or ID
exports.findUser = async ({ user_id, name, email }) => {
  const query = {};
  if (user_id) query.user_id = user_id;
  if (name) query.name = name;
  if (email) query.email = email;

  return await User.findOne({ where: query });
};

//  Fetch all users (Admin Only)
exports.getAllUsers = async () => {
  return await User.findAll();
};

//  Update user details (Admin Only)
exports.updateUser = async (user_id, updateData) => {
  const user = await User.findByPk(user_id);
  if (!user) return null;

  await user.update(updateData);
  return user;
};

//  Delete user (Admin Only)
exports.deleteUser = async (user_id) => {
  const user = await User.findByPk(user_id);
  if (!user) return false;

  await user.destroy();
  return true;
};


//  Change Membership Type
exports.changeMembership = async (userId, membership_type) => {
  try {
    console.log("Changing membership for user:", userId); // Debugging log
    const user = await User.findByPk(userId);

    if (!user) return { error: "User not found" };

    user.membership_type = membership_type;
    await user.save();
    return { success: "Membership updated successfully", user };
  } catch (error) {
    console.error("Membership update error:", error);
    return { error: "Internal Server Error" };
  }
};



// Reset Password (Forgot Password)
exports.resetUserPassword = async (email, newPassword) => {
  const user = await User.findOne({ where: { email } });

  if (!user) return { error: "User not found" };

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await user.update({ password: hashedPassword });

  return { success: "Password reset successfully" };
};

// Update Password (Change Password)
exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);

  if (!user) return { error: "User not found" };

  // Check if the old password matches
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return { error: "Incorrect old password" };

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await user.update({ password: hashedPassword });

  return { success: "Password updated successfully" };
};



////TESTED AND IS WORKING

exports.getUserProfile = async (user_id) => {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user;
};


exports.getUserBorrowedBooks = async (user_id) => {
  try {
    const borrowedBooks = await Borrow.findAll({
      where: { user_id, status: "Borrowed" },
      include: [
        {
          model: Book,
          as: "book",
          attributes: ["title", "author_id", "cover_url"],
          include: [
            {
              model: Author,
              as: "author",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    console.log("Borrowed Books Query:", borrowedBooks);
    return borrowedBooks;
  } catch (error) {
    throw new Error("Error fetching borrowed books in service.");
  }
};