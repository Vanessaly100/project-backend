const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");


router.get("/", authenticate, authorizeAdminOrUser, authorController.getAllAuthors);
router.get("/:id", authenticate, authorizeAdminOrUser, authorController.getAuthorById);
router.get("/name/:name", authenticate,authorizeAdminOrUser, authorController.getAuthorByName);

router.post("/", authenticate, authorizeAdmin, authorController.createAuthor);
router.put("/:id", authenticate, authorizeAdmin, authorController.updateAuthor);
router.delete("/:id", authenticate, authorizeAdmin, authorController.deleteAuthor);

module.exports = router;
