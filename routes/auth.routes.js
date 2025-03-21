
const express = require("express");
const { register, registerAdminController, login,logout  } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 
require("dotenv").config();
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(cookieParser()); 
// Authentication Routes
router.post("/user/register", register);
router.post("/register/admin", registerAdminController);
router.post("/login", login);
 



// Logout route
router.post("/logout", logout, (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});
//  Protected Route (Verify Auth)
router.get("/verify", authenticate, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

 
module.exports = router;


