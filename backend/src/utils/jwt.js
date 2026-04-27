const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("./ApiError");

const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Token expired");
    }
    throw ApiError.unauthorized("Invalid token");
  }
};

module.exports = { signToken, verifyToken };
