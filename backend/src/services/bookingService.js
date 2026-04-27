const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");
const ApiError = require("../utils/ApiError");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toDateOnly = (input) => {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw ApiError.badRequest("Invalid date value");
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const diffNights = (checkIn, checkOut) => {
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
  return nights;
};

const ensureValidDateRange = (checkIn, checkOut) => {
  const today = toDateOnly(new Date());
  if (checkIn < today) {
    throw ApiError.badRequest("Check-in date cannot be in the past");
  }
  if (checkOut <= checkIn) {
    throw ApiError.badRequest("Check-out must be after check-in");
  }
};

const createBooking = async ({ userId, roomId, checkIn, checkOut, guests }) => {
  const ci = toDateOnly(checkIn);
  const co = toDateOnly(checkOut);
  ensureValidDateRange(ci, co);

  const room = await roomModel.findById(roomId);
  if (!room) throw ApiError.notFound("Room not found");
  if (!room.is_active) throw ApiError.badRequest("Room is not available for booking");
  if (guests > room.capacity) {
    throw ApiError.badRequest(
      `Room capacity is ${room.capacity}, requested ${guests} guests`
    );
  }

  const nights = diffNights(ci, co);
  if (nights < 1) {
    throw ApiError.badRequest("Booking must be at least 1 night");
  }

  const totalPrice = Number(room.price_per_night) * nights;

  const booking = await bookingModel.createWithOverlapGuard({
    userId,
    roomId,
    checkIn: ci.toISOString().slice(0, 10),
    checkOut: co.toISOString().slice(0, 10),
    guests,
    totalPrice,
    status: "confirmed",
  });

  if (!booking) {
    throw ApiError.conflict(
      "Room is already booked for the selected dates"
    );
  }

  return booking;
};

const getById = async (id, currentUser) => {
  const booking = await bookingModel.findById(id);
  if (!booking) throw ApiError.notFound("Booking not found");

  if (currentUser.role !== "admin" && booking.user_id !== currentUser.id) {
    throw ApiError.forbidden("You cannot view this booking");
  }
  return booking;
};

const listForUser = (userId, options) => bookingModel.listForUser(userId, options);

const listAll = (options) => bookingModel.listAll(options);

const cancel = async (id, currentUser) => {
  const booking = await getById(id, currentUser);
  if (booking.status === "cancelled") {
    return booking;
  }
  if (booking.status === "completed") {
    throw ApiError.badRequest("Completed bookings cannot be cancelled");
  }
  return bookingModel.updateStatus(id, "cancelled");
};

const updateStatus = async (id, status) => {
  const updated = await bookingModel.updateStatus(id, status);
  if (!updated) throw ApiError.notFound("Booking not found");
  return updated;
};

module.exports = {
  createBooking,
  getById,
  listForUser,
  listAll,
  cancel,
  updateStatus,
};
