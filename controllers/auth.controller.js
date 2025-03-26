
const { registerUser, registerAdmin, loginUser  } = require("../services/auth.service");

const {User} = require("../models");

//  User Registration
const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
};

//  Admin Registration
const registerAdminController = async (req, res) => {
  try {
    const newAdmin = await registerAdmin(req.body);
    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const login  = async (req, res) => {
  try {
    const { token, role } = await loginUser(req.body, res);
   
    //  Set token as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful",token, role });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" }); // 🧹 Clear the cookie
  res.status(200).json({ message: "Logged out successfully" });
};


module.exports = { register, registerAdminController, login , logout };
 