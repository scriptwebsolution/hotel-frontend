const asyncHandler = require("../utils/asyncHandler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");

const listUsers = asyncHandler(async (_req, res) => {
  const users = await userModel.list();
  res.status(200).json({ success: true, data: users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  res.status(200).json({ success: true, data: user });
});

module.exports = { listUsers, getUser };
