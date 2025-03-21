

const ReservationService = require("../services/reservation.service");

class ReservationController {
  static async createReservation(req, res) {
    try {
      const { book_id } = req.params;
      const user_id = req.user.user_id; // Assuming authentication middleware
      const reservation = await ReservationService.createReservation(user_id, book_id);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllReservations(req, res) {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.json(reservations); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


static async getReservationById (req, res)  {
  try {
    const { id } = req.params;
    const reservation = await ReservationService.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
};



  static async updateReservationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const reservation = await ReservationService.updateReservationStatus(id, status);
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteReservation(req, res) {
    try {
      const { id } = req.params;
      const response = await ReservationService.deleteReservation(id);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReservationController;
