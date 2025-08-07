const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendTokenResponse = (user, res, message) => {
const { password_hash, ...userData } = user.toJSON();

const accessToken = jwt.sign(
  { id: user.user_id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { id: user.user_id },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "7d" }
);

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.status(200).json({
  message,
  accessToken,
  user: userData,
});
};


module.exports = sendTokenResponse;
