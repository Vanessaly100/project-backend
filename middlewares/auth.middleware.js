const { User } = require("../models");
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

 

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      console.log("Middleware Hit: Checking User Role");

      const token = req.cookies.token; // HttpOnly cookie
      console.log("Received Token:", token);

      if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
      }

      // Verify JWT
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log("Decoded Token:", decoded);

      const user = await User.findByPk(decoded.id);
      console.log("Fetched User from DB:", user);

      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied." });
      }
      
      req.user = user; 
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Invalid or expired token." });
    } 
  };
};


module.exports = { authenticate, checkRole };
