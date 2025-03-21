const express = require("express");
const router = express.Router();
const shareController = require("../controllers/share.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/share", authMiddleware.authenticate, shareController.shareBook);
router.post("/interact", authMiddleware.authenticate, shareController.trackInteraction);

module.exports = router;
