
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// General Authentication for All Users
const authenticateUser = (req, res, next) => {
  let token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user data to request
    console.log("Decoded Token:", decoded);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

//  Admin Authorization (Only Admins)
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden, admin access required" });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };


