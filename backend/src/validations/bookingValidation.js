const Joi = require("joi");

const idParam = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

const create = {
  body: Joi.object({
    roomId: Joi.string().uuid().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required(),
    guests: Joi.number().integer().min(1).default(1),
  }),
};

const updateStatus = {
  params: idParam.params,
  body: Joi.object({
    status: Joi.string()
      .valid("pending", "confirmed", "checkedin", "checkedout", "cancelled", "noshow")
      .required(),
  }),
};

const list = {
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(200).default(50),
    offset: Joi.number().integer().min(0).default(0),
    status: Joi.string().valid("pending", "confirmed", "checkedin", "checkedout", "cancelled", "noshow"),
  }),
};

const checkAvailability = {
  query: Joi.object({
    roomId: Joi.string().uuid().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required(),
  }),
};

module.exports = { idParam, create, updateStatus, list, checkAvailability };
