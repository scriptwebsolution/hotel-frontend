const asyncHandler = require("../utils/asyncHandler");
const bookingService = require("../services/bookingService");

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking({
    userId: req.user.id,
    roomId: req.body.roomId,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    guests: req.body.guests,
  });
  res.status(201).json({ success: true, data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listForUser(req.user.id, {
    limit: req.query.limit,
    offset: req.query.offset,
  });
  res.status(200).json({ success: true, data: bookings });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listAll({
    limit: req.query.limit,
    offset: req.query.offset,
    status: req.query.status,
  });
  res.status(200).json({ success: true, data: bookings });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getById(req.params.id, req.user);
  res.status(200).json({ success: true, data: booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancel(req.params.id, req.user);
  res.status(200).json({ success: true, data: booking });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: booking });
});

const checkAvailability = asyncHandler(async (req, res) => {
  const result = await bookingService.checkAvailability(
    req.query.roomId,
    req.query.checkIn,
    req.query.checkOut
  );
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  checkAvailability,
};
