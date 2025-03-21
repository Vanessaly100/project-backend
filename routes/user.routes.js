
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 

router.post("/borrow", authenticate, userController.borrowBook);
router.post("/redeem", authenticate, userController.redeemPoints);
router.put("/profile", authenticate, userController.updateProfile);
router.put("/membership", authenticate, userController.changeMembership);
router.delete("/delete", authenticate, userController.deleteUser); 

module.exports = router;
