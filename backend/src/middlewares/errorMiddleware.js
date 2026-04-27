const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err && err.code) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        statusCode = 409;
        message = "Duplicate value violates a unique constraint";
        details = err.sqlMessage;
        break;
      case "ER_NO_REFERENCED_ROW_2":
      case "ER_NO_REFERENCED_ROW":
        statusCode = 400;
        message = "Referenced resource does not exist";
        details = err.sqlMessage;
        break;
      case "ER_ROW_IS_REFERENCED_2":
      case "ER_ROW_IS_REFERENCED":
        statusCode = 409;
        message = "Resource is referenced by another record";
        details = err.sqlMessage;
        break;
      case "ER_CHECK_CONSTRAINT_VIOLATED":
        statusCode = 400;
        message = "Check constraint violated";
        details = err.sqlMessage;
        break;
      case "ER_BAD_NULL_ERROR":
      case "ER_DATA_TOO_LONG":
      case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
      case "ER_TRUNCATED_WRONG_VALUE":
        statusCode = 400;
        message = "Invalid input value";
        details = err.sqlMessage;
        break;
      case "ER_LOCK_DEADLOCK":
        statusCode = 409;
        message = "Conflicting transaction, please retry";
        break;
      case "ECONNREFUSED":
      case "PROTOCOL_CONNECTION_LOST":
        statusCode = 503;
        message = "Database is unavailable";
        break;
      default:
        break;
    }
  } else if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (err?.message) {
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }

  const body = {
    success: false,
    error: { message, ...(details ? { details } : {}) },
  };

  if (env.nodeEnv !== "production" && statusCode >= 500) {
    body.error.stack = err?.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = { notFoundHandler, errorHandler };
