
const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservation.controller");
const { authenticate, checkRole} = require("../middlewares/auth.middleware"); 


router.post("/:book_id/reserve", authenticate, checkRole(["user","admin"]), ReservationController.createReservation);
router.get("/", authenticate, checkRole(["user","admin"]), ReservationController.getAllReservations);

router.get("/:id", authenticate, checkRole(["user","admin"]), ReservationController.getReservationById);
router.put("/admin/:id", authenticate, checkRole(["admin"]), ReservationController.updateReservationStatus);
router.delete("/admin/:id", authenticate, checkRole(["admin"]), ReservationController.deleteReservation);

module.exports = router;
