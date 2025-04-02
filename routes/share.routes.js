const express = require("express");
const router = express.Router();
const shareController = require("../controllers/share.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/share", authMiddleware.authenticateUser, shareController.shareBook);
router.post("/interact", authMiddleware.authenticateUser, shareController.trackInteraction);

module.exports = router;
