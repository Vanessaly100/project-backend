const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");
const { authenticate,checkRole  } = require("../middlewares/auth.middleware");


router.get("/", authenticate, authorController.getAllAuthors);
router.get("/:id", authenticate, authorController.getAuthorById);
router.get("/name/:name", authenticate, authorController.getAuthorByName);

router.post("/", authenticate, checkRole(["admin"]), authorController.createAuthor);
router.put("/:id", authenticate, checkRole(["admin"]), authorController.updateAuthor);
router.delete("/:id", authenticate, checkRole(["admin"]), authorController.deleteAuthor);

module.exports = router;
