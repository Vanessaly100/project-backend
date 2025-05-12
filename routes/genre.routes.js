const express = require("express");
const genreController = require("../controllers/genre.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", authenticateUser, genreController.getAllGenre);

module.exports = router;
