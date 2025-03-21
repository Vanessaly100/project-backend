const bcrypt = require("bcryptjs");
const { User } = require("../models");

//  Hash Password Function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

//  Update User Profile
const updateUserProfile = async (userId, updates) => {
  try {
    console.log("Updating profile for user:", userId); 
    const user = await User.findByPk(userId);

    if (!user) return { error: "User not found" };

    Object.assign(user, updates);
    await user.save();
    return { success: "Profile updated successfully", user };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Internal Server Error" };
  }
};

//  Change Membership Type
const changeMembership = async (userId, membership_type) => {
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
// Delete User Function
const deleteUser = async (userId) => {
  try {
    console.log("Deleting user:", userId); // Debugging log
    const user = await User.findByPk(userId);

    if (!user) return false;

    await user.destroy();
    return true;
  } catch (error) {
    console.error("Delete user error:", error);
    return false;
  }
};

//  Exporting All Services
console.log("Exported userService:", { hashPassword, updateUserProfile, changeMembership, deleteUser });

module.exports = { hashPassword, updateUserProfile, changeMembership, deleteUser };
