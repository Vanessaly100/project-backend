
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const upload = require("../middlewares/uploadMiddleware");

router.put("/userUpdate-profile", authenticateUser, upload.single("profilePhoto"), userController.updateProfile);
router.get("/profile", authenticateUser, userController.getProfile);
router.get(
  "/all",
  authenticateUser,
  authorizeAdmin,
  userController.getAllUsers
);
router.get("/fetch", authenticateUser, userController.getUserByQuery);
router.post("/reset-password",authenticateUser, userController.resetPassword); 
router.put("/update-password/:userId",authenticateUser, userController.updatePassword); 

router.get(
  "/user/:userId",
  authenticateUser,
  userController.getUserProfileById
);

router.put("/update/:userId", authenticateUser, authorizeAdmin, userController.updateUser);

router.delete("/delete/:userId", authenticateUser, authorizeAdmin, userController.deleteUser);
router.post("/redeem",authenticateUser, userController.redeemPoints);
router.put("/membership", authenticateUser, userController.changeMembership);


router.get("/borrowed-books", authenticateUser, userController.getUserBorrowedBooks
);




module.exports = router;

