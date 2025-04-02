
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const upload = require("../middlewares/uploadMiddleware");

router.put("/userUpdate-profile", authenticateUser, upload.single("profilePhoto"), userController.updateProfile);
router.get("/user-profile", authenticateUser, userController.getUserProfile);

router.post("/reset-password",authenticateUser, userController.resetPassword); 
router.put("/update-password/:userId",authenticateUser, userController.updatePassword); 

router.get("/fetch", authenticateUser, userController.getUserByQuery);

router.get("/all", authenticateUser, authorizeAdmin, userController.getAllUsers);

router.put("/update/:userId", authenticateUser, authorizeAdmin, userController.updateUser);

router.delete("/delete/:userId", authenticateUser, authorizeAdmin, userController.deleteUser);
router.post("/redeem",authenticateUser, userController.redeemPoints);
router.put("/membership", authenticateUser, userController.changeMembership);



module.exports = router;

