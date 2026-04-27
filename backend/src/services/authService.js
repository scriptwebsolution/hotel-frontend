const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at,
});

const buildAuthPayload = (user) => ({
  user: sanitizeUser(user),
  token: signToken({ sub: user.id, email: user.email, role: user.role }),
});

const register = async ({ name, email, password, role }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw ApiError.conflict("Email is already registered");
  }

  const passwordHash = await hashPassword(password);
  const user = await userModel.create({ name, email, passwordHash, role });
  return buildAuthPayload(user);
};

const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const matches = await comparePassword(password, user.password_hash);
  if (!matches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  return buildAuthPayload(user);
};

const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return sanitizeUser(user);
};

module.exports = { register, login, getProfile };
