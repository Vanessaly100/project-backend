
const ReservationService = require("../services/reservation.service");
const asyncHandler = require("express-async-handler");


exports.createReservation = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { book_id } = req.body;

  const reservation = await ReservationService.createReservation({
    user_id,
    book_id,
  });

  res.status(201).json({
    success: true,
    message: "Reservation successfully created.",
    data: reservation,
  });
});

exports.getUserReservations = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const queryParams = req.query;

  const result = await ReservationService.getUserReservations(
    user_id,
    queryParams
  );

  res.status(200).json({
    success: true,
    reservations: result.reservations,
    pagination: result.pagination,
  });
});


exports.getAllAdminReservations = asyncHandler(async (req, res) => {
  const result = await ReservationService.getAdminReservations(req.query);
    
      res.status(200).json({
        reservations: result.reservations,
        pagination: result.pagination,
      });
});

exports.cancelReservation = asyncHandler(async (req, res) => {
   const { reservationId } = req.params;
   const userId = req.user.id;
   console.log("User ID:", userId); 
   const canceledReservation = await ReservationService.cancelReservation(
     reservationId,
     userId
   );

   res.status(200).json({
     success: true,
     message: "Reservation canceled successfully",
     data: canceledReservation,
   });
  
});

exports.fulfillReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId; 
    const userId = req.user.id;

    console.log("Fulfilling reservation for:", {
      reservationId, 
      userId,
    });

    const result = await ReservationService.fulfillReservation(
      reservationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Reservation fulfilled successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fulfilling reservation:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      trace: error.stack,
    });
  }
};


exports.cancelReservationByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: "Cancellation reason is required",
    });
  }

  const result = await ReservationService.cancelReservationByAdmin(id, reason);

  res.status(200).json({
    success: true,
    message: "Reservation canceled successfully",
    data: result,
  });
});

exports.deleteReservation=async(req, res)=> {
    try {
      const { id } = req.params;
      const response = await ReservationService.deleteReservation(id);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }