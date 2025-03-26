

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const env = require("../config/env");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || process.env.JWT_SECRET; 

//  Register a new user
const registerUser = async ({ first_name, last_name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    first_name, last_name, email, 
   password_hash: hashedPassword, 
      role: "user",
  });
};

//  Register an admin (Only admins can register new admins)
const registerAdmin = async ({ first_name, last_name, email, password, adminSecret }) => {
  if (adminSecret !== "ADMIN_SECRET") throw new Error("Unauthorized to create an admin account");

  const existingAdmin = await User.findOne({ where: { email } });
  if (existingAdmin) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    first_name, last_name, email,
    password_hash: hashedPassword, 
    role: "admin",
  });
};


//  Login for both users & admins
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    SECRET_KEY,
    { expiresIn: "7d" }
  );

console.log(token)
  return { token, role: user.role }; 
};

module.exports = { registerUser, registerAdmin, loginUser  };
