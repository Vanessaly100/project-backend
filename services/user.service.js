const bcrypt = require("bcryptjs");
const { User, Borrow, Book, Author, Reservation } = require("../models");
const { Op } = require("sequelize");
// const cloudinary = require("../middlewares/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");

// Hash Password Function
exports.hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new InternalServerErrorException("Error hashing password");
  }
};

// Get User by ID
exports.getUserById = async (user_id) => {
  const user = await User.findByPk(user_id);
  if (!user) throw new NotFoundException("User not found");
  return user;
};

// Find User by ID, name, or email
exports.findUser = async ({ user_id, name, email }) => {
  const query = {};
  if (user_id) query.user_id = user_id;
  if (name) query.name = name;
  if (email) query.email = email;

  try {
    return await User.findOne({ where: query });
  } catch (error) {
    throw new InternalServerErrorException("Error finding user");
  }
};

// Update User Profile


exports.updateUserProfile = async (userId, updateData, file) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("User not found");

  let profilePictureUrl = user.profile_picture_url;
  let profilePicturePublicId = user.profile_picture_public_id;

  if (file) {
    // Delete the old picture from Cloudinary if it exists
    if (profilePicturePublicId) {
      await cloudinary.uploader.destroy(profilePicturePublicId);
    }

    // Upload the new picture to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);
    profilePictureUrl = result.secure_url;
    profilePicturePublicId = result.public_id;

    // Update the fields related to the profile picture
    updateData.profile_picture_url = profilePictureUrl;
    updateData.profile_picture_public_id = profilePicturePublicId;
  }

  try {
    await user.update(updateData);
    return user;
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException("Failed to update profile");
  }
};


exports.updateUserByAdmin = async (user_id, updateData) => {
  const user = await User.findByPk(user_id);
  if (!user) throw new NotFoundException("User not found");
  return await user.update(updateData);
};




// Get All Users with pagination, sorting, and filtering
exports.getAllUsers = async ({
  page = 1,
  limit = 5,
  sort = "createdAt",
  order = "desc",
  filter = "",
}) => {
 
   const pageInt = parseInt(page, 10); // Convert to integer
   const limitInt = parseInt(limit, 10);

    // Fetch users with pagination, sorting, and filtering
    const users = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${filter}%` } },
          { last_name: { [Op.iLike]: `%${filter}%` } },
          { email: { [Op.iLike]: `%${filter}%` } },
        ],
      },
      order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
      limit: limitInt,
      offset: (pageInt - 1) * limitInt,
    });

   const totalPages = Math.ceil(users.count / limitInt);

    return {
      users: users.rows,
      pagination: {
        totalItems: users.count,
        currentPage: pageInt,
        totalPages,
        pageSize: limitInt,
      },
    };
}


exports.getUserDetailsById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: Borrow,
        as: "borrows",
        include: [{ model: Book, as: "book" }],
      },
      {
        model: Reservation,
        as: "reservations",
        include: [{ model: Book, as: "book" }],
      },
    ],
  });
};
// Delete User (Admin Only)
exports.deleteUser = async (user_id) => {
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new NotFoundException("User not found");
  }
    await user.destroy();
    return { message: "User deleted successfully" };
};

// Change Membership Type
exports.changeMembership = async (userId, membership_type) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("User not found");

  user.membership_type = membership_type;
  try {
    await user.save();
    return { success: "Membership updated successfully", user };
  } catch (error) {
    throw new InternalServerErrorException("Failed to update membership");
  }
};

// Reset User Password (Forgot Password)
exports.resetUserPassword = async (email, newPassword) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new NotFoundException("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await user.update({ password: hashedPassword });
    return { success: "Password reset successfully" };
  } catch (error) {
    throw new InternalServerErrorException("Failed to reset password");
  }
};

// Update User Password (Change Password)
exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new BadRequestException("Incorrect old password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await user.update({ password: hashedPassword });
    return { success: "Password updated successfully" };
  } catch (error) {
    throw new InternalServerErrorException("Failed to update password");
  }
};

// Get User Profile (excluding password)
exports.getUserProfile = async (user_id) => {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new NotFoundException("User not found");
  return user;
};

// Get User Borrowed Books
exports.getUserBorrowedBooks = async (user_id) => {
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

  if (borrowedBooks.length === 0) {
    throw new NotFoundException("No borrowed books found");
  }

  return borrowedBooks;
};
