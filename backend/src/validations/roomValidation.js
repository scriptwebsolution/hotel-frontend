const Joi = require("joi");

const idParam = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

const create = {
  body: Joi.object({
    roomNumber: Joi.string().max(20).required(),
    type: Joi.string().max(40).required(),
    pricePerNight: Joi.number().precision(2).min(0).required(),
    capacity: Joi.number().integer().min(1).default(1),
    description: Joi.string().allow("", null).max(2000),
    isActive: Joi.boolean().default(true),
  }),
};

const update = {
  params: idParam.params,
  body: Joi.object({
    roomNumber: Joi.string().max(20),
    type: Joi.string().max(40),
    pricePerNight: Joi.number().precision(2).min(0),
    capacity: Joi.number().integer().min(1),
    description: Joi.string().allow("", null).max(2000),
    isActive: Joi.boolean(),
  }).min(1),
};

const availability = {
  query: Joi.object({
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required(),
    capacity: Joi.number().integer().min(1).default(1),
  }),
};

module.exports = { idParam, create, update, availability };
