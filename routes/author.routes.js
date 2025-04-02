const express = require("express");

const authorController = require("../controllers/author.controller");
const { authenticateUser, authorizeAdmin, } = require("../middlewares/auth.middleware");
const router = express.Router();


router.get("/", authenticateUser,authorController.getAllAuthors);
router.get("/:id", authenticateUser, authorController.getAuthorById);
router.get("/name/:name", authenticateUser, authorController.getAuthorByName);

router.post("/", authenticateUser, authorizeAdmin, authorController.createAuthor);
router.put("/:id", authenticateUser, authorizeAdmin, authorController.updateAuthor);
router.delete("/:id", authenticateUser, authorizeAdmin, authorController.deleteAuthor);

module.exports = router;
