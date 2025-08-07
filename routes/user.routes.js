
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/uploadMiddleware");

router.put("/update-profile",authenticateUser,upload.single("profilePicture"),userController.updateUserProfile);
router.get("/profile", authenticateUser, userController.getProfile);
router.get("/all",authenticateUser,authorizeAdmin,userController.getAllUsers);
router.get("/fetch", authenticateUser, userController.getUserByQuery);
router.get(
  "/:id/details",
  authenticateUser,
  authorizeAdmin,
  userController.getUserDetails
);
router.post("/reset-password",authenticateUser, userController.resetPassword); 
router.put("/update-password/:userId",authenticateUser, userController.updatePassword); 

router.get( "/user/:userId", authenticateUser, userController.getUserProfileById);

router.put(
  "/update-user/:id",
 authenticateUser,
  authorizeAdmin,
  userController.adminUpdateUser
);

router.delete("/delete/:id", authenticateUser, authorizeAdmin, userController.deleteUser);
router.post("/redeem",authenticateUser, userController.redeemPoints);
router.put("/membership", authenticateUser, userController.changeMembership);
 

router.get("/borrowed-books", authenticateUser, userController.getUserBorrowedBooks
);





module.exports = router;

