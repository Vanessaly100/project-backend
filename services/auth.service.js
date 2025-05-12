const bcrypt = require("bcryptjs");
const { User } = require("../models");
require("dotenv").config();
const userService = require("../services/user.service");
const {
  ValidationException,
  NotFoundException,
  UnauthorizedException,
} = require("../lib/errors.definitions");

const SECRET_KEY = process.env.JWT_SECRET || process.env.JWT_SECRET;

// Register a new user
const registerUser = async ({ first_name, last_name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new ValidationException("Email already in use");

  const hashedPassword = await userService.hashPassword(password);

  return await User.create({
    first_name,
    last_name,
    email,
    password_hash: hashedPassword,
    role: "user",
  });
};

// Register an admin
const registerAdmin = async ({
  first_name,
  last_name,
  email,
  password,
  adminSecret,
}) => {
  if (adminSecret !== "ADMIN_SECRET") {
    throw new UnauthorizedException("Unauthorized to create an admin account");
  }

  const existingAdmin = await User.findOne({ where: { email } });
  if (existingAdmin) throw new ValidationException("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    first_name,
    last_name,
    email,
    password_hash: hashedPassword,
    role: "admin",
  });
};

// Login for users & admins
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ValidationException("Email and password are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new NotFoundException("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new UnauthorizedException("Invalid email or password");

  return user;
};

module.exports = { registerUser, registerAdmin, loginUser };
