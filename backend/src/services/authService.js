const { OAuth2Client } = require("google-auth-library");

const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const googleClient = env.google.clientId
  ? new OAuth2Client(env.google.clientId)
  : null;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatar_url || null,
  googleLinked: Boolean(user.google_id),
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
  if (!user || !user.password_hash) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const matches = await comparePassword(password, user.password_hash);
  if (!matches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  return buildAuthPayload(user);
};

const verifyGoogleIdToken = async (idToken) => {
  if (!googleClient) {
    throw ApiError.internal(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID on the server."
    );
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });
    return ticket.getPayload();
  } catch (_err) {
    throw ApiError.unauthorized("Invalid Google credential");
  }
};

const googleAuth = async ({ credential }) => {
  if (!credential) {
    throw ApiError.badRequest("Missing Google credential token");
  }

  const payload = await verifyGoogleIdToken(credential);
  if (!payload?.email_verified) {
    throw ApiError.unauthorized("Google account email is not verified");
  }

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || email.split("@")[0];
  const avatarUrl = payload.picture || null;

  let user = await userModel.findByGoogleId(googleId);

  if (!user) {
    const byEmail = await userModel.findByEmail(email);
    if (byEmail) {
      user = await userModel.linkGoogleAccount(byEmail.id, {
        googleId,
        avatarUrl,
      });
    } else {
      user = await userModel.create({
        name,
        email,
        googleId,
        avatarUrl,
        role: "guest",
      });
    }
  }

  return buildAuthPayload(user);
};

const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return sanitizeUser(user);
};

module.exports = { register, login, googleAuth, getProfile };
