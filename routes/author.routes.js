const express = require("express");
const authorController = require("../controllers/author.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");
const authorSchema = require("../validators/author.validation");
const validate = require("../middlewares/validateRequest");


const router = express.Router();

router.get("/", authenticateUser, authorController.getAllAuthors);
router.get(
  "/no-filter-all",
  authenticateUser,
  authorController.fetchAllAuthorsNoLimit
);
router.get(
  "/books-per-author",
  authenticateUser,
  authorController.getBookCountPerAuthor
);

router.get("/:id", authenticateUser, authorController.getAuthorById);
router.get("/name/:name", authenticateUser, authorController.getAuthorByName);

router.post(
  "/",
  authenticateUser,
  authorizeAdmin,
  validate(authorSchema),
  authorController.createAuthor
);
router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  authorController.updateAuthor
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  authorController.deleteAuthor
);

module.exports = router;
