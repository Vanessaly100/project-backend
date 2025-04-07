
const { registerUser, registerAdmin, loginUser  } = require("../services/auth.service");
const sendTokenResponse = require("../lib/sendToken");



//  User Registration
const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    sendTokenResponse(newUser, res, "User registered successfully");
    // res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
};

//  Admin Registration
const registerAdminController = async (req, res) => {
  try {
    const newAdmin = await registerAdmin(req.body);
    sendTokenResponse(newAdmin, res, "Admin registered successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    sendTokenResponse(user, res, "Login successful");
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};


module.exports = { register, registerAdminController, login , logout };
 