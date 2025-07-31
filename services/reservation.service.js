
const { Reservation, Notification, Book,User} = require("../models");
const { Op } = require("sequelize");
const {
  BadRequestException,
  NotFoundException,
} = require("../lib/errors.definitions");
const logActivity = require("../services/activityLogger.service");
const { sendNotification } = require("../lib/socket");


// // Get a reservation by ID
// exports.getReservationById = async (reservation_id) => {
//   return await Reservation.findByPk(reservation_id, { include: ["user", "book"] });
// };

exports.createReservation = async ({ user_id, book_id }) => {
  const book = await Book.findByPk(book_id);
  if (!book) throw new NotFoundException("Book not found");

  const existingReservation = await Reservation.findOne({
    where: {
      user_id,
      book_id,
      status: { [Op.not]: "fulfilled" },
    },
  });

  if (existingReservation) {
    throw new Error("You have already reserved this book.");
  }

  const reservation = await Reservation.create({
    user_id,
    book_id,
    reservation_date: new Date(),
    status: "pending",
  });

  const user = await User.findByPk(user_id);
  if (!user) throw new NotFoundException("User not found");

  const admins = await User.findAll({
    where: { role: "admin" },
    attributes: ["user_id", "first_name", "email", "role"],
  });

  for (const admin of admins) {
    const adminNotification = await Notification.create({
      user_id: admin.user_id,
      type: "Reservation",
      message: ` ${user.first_name} reserved "${book.title}"`,
      role: "admin",
      book_id: book.book_id,
    });
    sendNotification(admin.user_id, adminNotification);
  }

  const userNotification = await Notification.create({
    user_id: user.user_id,
    type: "Reservation",
    message: `Reservation placed: You reserved "${book.title}". We'll notify you when it's available.`,
    role: "user",
    book_id: book.book_id,
  });
  sendNotification(user.user_id, userNotification);
  // Activity Log on Dashboard
  await logActivity({
    user_id: user.user_id,
    type: "reserve",
    book_id: book.book_id,
  });

  return reservation;
};



exports.getUserReservations = async (
  user_id,
  { page = 1, limit = 7, sort = "createdAt", order = "desc", filter = "" }
) => {
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  const reservations = await Reservation.findAndCountAll({
    where: {
      user_id,
      [Op.or]: [
        { "$book.title$": { [Op.iLike]: `%${filter}%` } },
        { "$user.first_name$": { [Op.iLike]: `%${filter}%` } },
        // You can add other searchable fields here
        ,
      ],
    },
    order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    limit: limitInt,
    offset: (pageInt - 1) * limitInt,
    include: [{ model: Book, as: "book", attributes: ["book_id", "title", "cover_url"] },
      { model: User, as: "user", attributes: ["user_id", "first_name"] },
    ],
  });

  const totalPages = Math.ceil(reservations.count / limitInt);

  return {
    reservations: reservations.rows,
    pagination: {
      totalItems: reservations.count,
      currentPage: pageInt,
      totalPages,
      pageSize: limitInt,
    },
  };
};

exports.getAdminReservations = async (query) => {
  const {
    page = 1,
    limit = 7,
    sort = "createdAt",
    order = "ASC",
    filter = "",
  } = query;

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  const result = await Reservation.findAndCountAll({
    where: {
      [Op.or]: [
        { "$user.first_name$": { [Op.iLike]: `%${filter}%` } },
        { "$user.email$": { [Op.iLike]: `%${filter}%` } },
        { "$book.title$": { [Op.iLike]: `%${filter}%` } },
        // { "$type$": { [Op.iLike]: `%${filter}%` } },
      ],
    },
    include: [
      { model: Book, as: "book", attributes: ["title"] },
      {
        model: User,
        as: "user",
        attributes: ["first_name", "last_name", "email", "profile_picture_url"],
      },
    ],
    order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    limit: limitInt,
    offset: (pageInt - 1) * limitInt,
  });

  const totalPages = Math.ceil(result.count / limitInt);

  return {
    reservations: result.rows,
    pagination: {
      totalItems: result.count,
      currentPage: pageInt,
      totalPages,
      pageSize: limitInt,
    },
  };
};


exports.cancelReservation = async (id, user_id) => {
  const reservation = await Reservation.findOne({
    where: { reservation_id: id, user_id },
  });

  if (!reservation) throw new NotFoundException("Reservation not found");
  if (reservation.status !== "pending")
    throw new BadRequestException("Only pending reservations can be canceled");

  if (reservation.status === "canceled") {
    throw new Error("Reservation is already canceled");
  }

  const updatedReservation = await reservation.update({
    status: "canceled",
    canceledAt: new Date(),
  });

  const user = await User.findByPk(reservation.user_id);
  const book = await Book.findByPk(reservation.book_id);

  if (!user || !book)
    throw new Error("User or Book not found for notification");

  // Notify user
  await Notification.create({
    user_id: reservation.user_id,
    message: `Reservation: ${user.first_name}, your reservation for "${book.title}" has been cancelled, because we could't restock sooner,sorry for inconveniences.`,
    type: "Reservation",
    role: "user",
    book_id: book.book_id,
  });

  return updatedReservation;
};

// Cancel a reservation with a reason
exports.cancelReservationByAdmin = async (reservationId, reason) => {
  const reservation = await Reservation.findByPk(reservationId, {
    include: [{model: Book, as: "book", attributes:["title"]},{model: User, as: "user" , attributes:["first_name"]}],
  });

  if (!reservation) throw new NotFoundException("Reservation not found");

  reservation.status = "canceled";
  reservation.canceledAt = new Date();
  await reservation.save();
  const user = await User.findByPk(reservation.user_id);
  const book = await Book.findByPk(reservation.book_id);
  // Notify user
  const message = ` ${user.first_name}Your reservation for "${book.title}" has been canceled. Reason: ${reason}`;
  await Notification.create({
    user_id: reservation.user_id,
    book_id: reservation.book_id,
    message,
    type: "Reservation",
    role: "user",
  });

  sendNotification(reservation.user_id, { message });

  return reservation;
};

exports.fulfillReservation = async (reservationId, requestingUserId, role) => {
  const reservation = await Reservation.findOne({
    where: {
      reservation_id: reservationId,
    },
    include: [
      {
        model: Book,
        as: "book",
      },
    ],
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  
  if (role !== "admin" && reservation.user_id !== requestingUserId) {
    throw new Error("Unauthorized to fulfill this reservation");
  }

  if (reservation.status === "fulfilled") {
    throw new Error("Reservation is already fulfilled");
  }

  if (reservation.status === "canceled") {
    throw new Error("Cannot fulfill a canceled reservation");
  }

  const updatedReservation = await reservation.update({
    status: "fulfilled",
    fulfilledAt: new Date(),
  });

  const user = await User.findByPk(reservation.user_id);
  const book = await Book.findByPk(reservation.book_id);

  await Notification.create({
    user_id: reservation.user_id,
    book_id: reservation.book_id,
    borrow_id: null,
    message: `Reservation: ${user.first_name}, your reserved book "${book.title}" is now available for borrowing.`,
    notification_type: "Reservation",
    role: "user",
  });

  return updatedReservation;
};



exports.deleteReservation = async(reservation_id) =>{
    const reservation = await Reservation.findByPk(reservation_id);
    if (!reservation) throw new Error("Reservation not found");

    await reservation.destroy();
    return { message: "Reservation deleted" };
  }