

const { Reservation, Book, User } = require("../models");

class ReservationService {
  static async createReservation(user_id, book_id) {
    const book = await Book.findByPk(book_id);
    if (!book) throw new Error("Book not found");

    const reservation = await Reservation.create({ user_id, book_id });
    return reservation;
  }

  static async getAllReservations() {
    return await Reservation.findAll({ 
      include: [
         { model: User, as: "user", attributes: ["first_name", "last_name", "email"] }, 
    { model: Book, as: "book", attributes: ["title"] }
      ],
    });
  }

  
static async getReservationById  (reservationId)  {
  return await Reservation.findOne({ where: { reservation_id: reservationId } });
};


  static async updateReservationStatus(reservation_id, status) {
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation) throw new Error("Reservation not found");

    reservation.status = status;
    await reservation.save();
    return reservation;
  }

  static async deleteReservation(reservation_id) {
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation) throw new Error("Reservation not found");

    await reservation.destroy();
    return { message: "Reservation deleted" };
  }
}

module.exports = ReservationService;

