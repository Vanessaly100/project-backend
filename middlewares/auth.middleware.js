const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET; 

const authenticate = (req, res, next) => {

   console.log("Received Cookies:", req.cookies); 
  console.log("Authorization Header:", req.headers.authorization);

 
  let token = req.cookies.token;

  // If not found in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization.split(" ");
    if (authHeader[0] === "Bearer") {
      token = authHeader[1]; 
    }
  }

  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    console.log("Decoded Token:", decoded); 

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden, admin access required" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); 
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};


//AUTHORIZATION
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
const authorizeUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  next();
};

// If both Admin & User should access a route
const authorizeAdminOrUser = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser };


