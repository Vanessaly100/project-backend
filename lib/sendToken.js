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
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message,
    token, 
    role: user.role, 
    user,
  });
};


module.exports = sendTokenResponse;
