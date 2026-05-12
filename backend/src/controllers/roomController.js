const asyncHandler = require("../utils/asyncHandler");
const roomService = require("../services/roomService");

const list = asyncHandler(async (req, res) => {
  const options = {
    activeOnly: req.query.activeOnly !== "false",
    limit: parseInt(req.query.limit, 10) || 100,
    offset: parseInt(req.query.offset, 10) || 0,
  };
  const rooms = await roomService.getAll(options);
  res.status(200).json({ success: true, data: rooms });
});

const getOne = asyncHandler(async (req, res) => {
  const room = await roomService.getById(req.params.id);
  res.status(200).json({ success: true, data: room });
});

const create = asyncHandler(async (req, res) => {
  const room = await roomService.create(req.body);
  res.status(201).json({ success: true, data: room });
});

const update = asyncHandler(async (req, res) => {
  const room = await roomService.update(req.params.id, req.body);
  res.status(200).json({ success: true, data: room });
});

const remove = asyncHandler(async (req, res) => {
  await roomService.remove(req.params.id);
  res.status(204).send();
});

const availability = asyncHandler(async (req, res) => {
  const rooms = await roomService.getAvailable({
    checkIn: req.query.checkIn,
    checkOut: req.query.checkOut,
    capacity: req.query.capacity,
  });
  res.status(200).json({ success: true, data: rooms });
});

module.exports = { list, getOne, create, update, remove, availability };
