const Joi = require("joi");

const ID_PROOF_TYPES = ["Aadhar", "Passport", "DrivingLicense", "VoterID", "Other"];

const idParam = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

const create = {
  body: Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().max(20).required(),
    address: Joi.string().max(1000).allow("", null),
    idProofType: Joi.string().valid(...ID_PROOF_TYPES).allow(null),
    idProofNumber: Joi.string().max(100).allow("", null),
  }),
};

const update = {
  params: idParam.params,
  body: Joi.object({
    name: Joi.string().max(100),
    email: Joi.string().email().max(100),
    phone: Joi.string().max(20),
    address: Joi.string().max(1000).allow("", null),
    idProofType: Joi.string().valid(...ID_PROOF_TYPES).allow(null),
    idProofNumber: Joi.string().max(100).allow("", null),
  }).min(1),
};

const list = {
  query: Joi.object({
    search: Joi.string().max(100).allow(""),
    limit: Joi.number().integer().min(1).max(200).default(100),
    offset: Joi.number().integer().min(0).default(0),
  }),
};

module.exports = { idParam, create, update, list };
