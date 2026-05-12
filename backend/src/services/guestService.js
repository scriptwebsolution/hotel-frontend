const guestModel = require("../models/guestModel");
const ApiError = require("../utils/ApiError");

const getAll = ({ search, limit, offset } = {}) =>
  guestModel.getAll({ search, limit, offset });

const getById = async (id) => {
  const guest = await guestModel.getById(id);
  if (!guest) throw ApiError.notFound("Guest not found");
  return guest;
};

const create = async (payload) => {
  const emailExists = await guestModel.findByEmail(payload.email);
  if (emailExists) throw ApiError.conflict("Guest already exists");

  const phoneExists = await guestModel.findByPhone(payload.phone);
  if (phoneExists) throw ApiError.conflict("Guest already exists");

  return guestModel.create(payload);
};

const update = async (id, payload) => {
  await getById(id);

  if (payload.email) {
    const emailExists = await guestModel.findByEmail(payload.email);
    if (emailExists && emailExists.id !== id) {
      throw ApiError.conflict("Guest already exists");
    }
  }

  if (payload.phone) {
    const phoneExists = await guestModel.findByPhone(payload.phone);
    if (phoneExists && phoneExists.id !== id) {
      throw ApiError.conflict("Guest already exists");
    }
  }

  return guestModel.update(id, payload);
};

const remove = async (id) => {
  await getById(id);
  const ok = await guestModel.remove(id);
  if (!ok) throw ApiError.notFound("Guest not found");
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
