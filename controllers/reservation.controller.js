
// controllers/reservationController.js
const reservationService = require("../services/reservation.service");


// Create a reservation
exports.createReservation = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    const reservation = await reservationService.createReservation(user_id, book_id);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const reservation = await reservationService.getReservationById(reservation_id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fulfill a reservation (convert to borrow)
exports.fulfillReservation = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const reservation = await reservationService.fulfillReservation(reservation_id);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const reservation = await reservationService.cancelReservation(reservation_id);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteReservation=async(req, res)=> {
    try {
      const { id } = req.params;
      const response = await reservationService.deleteReservation(id);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }