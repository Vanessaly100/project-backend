
const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin, authorizeUser, authorizeAdminOrUser } = require("../middlewares/auth.middleware");
const reservationController = require("../controllers/reservation.controller");


router.post("/", reservationController.createReservation);
router.get("/", reservationController.getAllReservations);
router.get("/:reservation_id", reservationController.getReservationById);
router.put("/:reservation_id/fulfill", reservationController.fulfillReservation);
router.put("/:reservation_id/cancel", reservationController.cancelReservation);

module.exports = router;
