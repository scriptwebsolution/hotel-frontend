const roomModel = require("../models/roomModel");
const ApiError = require("../utils/ApiError");

const getAll = (options) => roomModel.list(options);

const getById = async (id) => {
  const room = await roomModel.findById(id);
  if (!room) throw ApiError.notFound("Room not found");
  return room;
};

const create = (payload) => roomModel.create(payload);

const update = async (id, payload) => {
  await getById(id);
  return roomModel.update(id, payload);
};

const remove = async (id) => {
  const ok = await roomModel.remove(id);
  if (!ok) throw ApiError.notFound("Room not found");
  return true;
};

const getAvailable = ({ checkIn, checkOut, capacity }) =>
  roomModel.findAvailable({ checkIn, checkOut, capacity });

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAvailable,
};
