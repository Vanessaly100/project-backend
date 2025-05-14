
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");
const reservationController = require("../controllers/reservation.controller");

// router.get("/:reservation_id", reservationController.getReservationById);
router.post("/", authenticateUser, reservationController.createReservation);
router.get("/my", authenticateUser, reservationController.getUserReservations);
router.get(
  "/all",
  authenticateUser,
  reservationController.getAllAdminReservations
);
router.put(
  "/:reservationId/user/cancel",
  authenticateUser,
  reservationController.cancelReservation
);
router.put(
  "/:reservationId/fulfill",
  authenticateUser,
  authorizeAdmin,
  reservationController.fulfillReservation
);
router.put(
  "/:id/admin/cancel",
  authenticateUser,
  authorizeAdmin,
  reservationController.cancelReservationByAdmin
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  reservationController.deleteReservation
);


module.exports = router;
