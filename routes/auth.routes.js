
const express = require("express");
const { register, registerAdminController, login,logout  } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth.middleware"); 
require("dotenv").config();
const cookieParser = require("cookie-parser");
const router = express.Router();


router.use(cookieParser()); 
router.post("/user/register", register);
router.post("/register/admin", registerAdminController);
router.post("/login", login);
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout route
router.post("/logout", logout, (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});
//  Protected Route (Verify Auth)
router.get("/verify", authenticateUser, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});


module.exports = router;


