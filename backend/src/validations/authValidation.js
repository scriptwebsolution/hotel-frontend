const Joi = require("joi");

const register = {
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().max(160).required(),
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string().valid("guest", "staff", "admin").default("guest"),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { register, login };
