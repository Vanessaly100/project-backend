
const { Reservation, Notification, Book } = require("../models");

// Create a reservation
exports.createReservation = async (user_id, book_id) => {
  const reservation = await Reservation.create({ user_id, book_id });

  // Notify the user
  await Notification.create({
    user_id,
    message: `Your reservation for book ID ${book_id} is pending.`,
    notification_type: "Reservation",
  });

  return reservation;
};

// Get all reservations
exports.getAllReservations = async () => {
  return await Reservation.findAll({
    include: ["user", "book"],
    order: [["createdAt", "DESC"]],
  });
};

// Get a reservation by ID
exports.getReservationById = async (reservation_id) => {
  return await Reservation.findByPk(reservation_id, { include: ["user", "book"] });
};

// Fulfill a reservation (convert to borrow)
exports.fulfillReservation = async (reservation_id) => {
  const reservation = await Reservation.findByPk(reservation_id);
  if (!reservation) throw new Error("Reservation not found");

  // Update reservation status
  await reservation.update({ status: "Fulfilled" });

  // Notify user
  await Notification.create({
    user_id: reservation.user_id,
    message: `Your reserved book (ID: ${reservation.book_id}) is now available for borrowing.`,
    notification_type: "Reservation",
  });

  return reservation;
};

// Cancel a reservation
exports.cancelReservation = async (reservation_id) => {
  const reservation = await Reservation.findByPk(reservation_id);
  if (!reservation) throw new Error("Reservation not found");

  await reservation.update({ status: "Cancelled" });

  // Notify user
  await Notification.create({
    user_id: reservation.user_id,
    message: `Your reservation for book ID ${reservation.book_id} has been cancelled.`,
    notification_type: "Reservation",
  });

  return reservation;
};

exports.deleteReservation = async(reservation_id) =>{
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation) throw new Error("Reservation not found");

    await reservation.destroy();
    return { message: "Reservation deleted" };
  }