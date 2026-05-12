const asyncHandler = require("../utils/asyncHandler");
const guestService = require("../services/guestService");

const list = asyncHandler(async (req, res) => {
  const { search, limit, offset } = req.query;
  const guests = await guestService.getAll({ search, limit, offset });
  res.status(200).json({ success: true, data: guests });
});

const getById = asyncHandler(async (req, res) => {
  const guest = await guestService.getById(req.params.id);
  res.status(200).json({ success: true, data: guest });
});

const create = asyncHandler(async (req, res) => {
  const guest = await guestService.create(req.body);
  res.status(201).json({ success: true, data: guest });
});

const update = asyncHandler(async (req, res) => {
  const guest = await guestService.update(req.params.id, req.body);
  res.status(200).json({ success: true, data: guest });
});

const remove = asyncHandler(async (req, res) => {
  await guestService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
