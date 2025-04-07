const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendTokenResponse = (user, res, message) => {
  // Generate the token
  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Send the token as HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send the response with the message, token, and user info
  res.status(200).json({
    message,
    token, // Return the token
    role: user.role, // Return the role
    user, // Optionally return the user details
  });
};


module.exports = sendTokenResponse;
