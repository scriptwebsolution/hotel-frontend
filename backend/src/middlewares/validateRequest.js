const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, _res, next) => {
  const targets = ["body", "query", "params"];
  const errors = [];

  for (const key of targets) {
    if (!schema[key]) continue;
    const { value, error } = schema[key].validate(req[key], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      errors.push(
        ...error.details.map((d) => ({
          field: `${key}.${d.path.join(".")}`,
          message: d.message,
        }))
      );
    } else {
      req[key] = value;
    }
  }

  if (errors.length) {
    return next(ApiError.badRequest("Validation failed", errors));
  }
  return next();
};

module.exports = validate;
