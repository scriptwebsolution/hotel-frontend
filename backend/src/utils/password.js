const bcrypt = require("bcryptjs");
const env = require("../config/env");

const hashPassword = (plain) => bcrypt.hash(plain, env.bcrypt.saltRounds);

const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { hashPassword, comparePassword };
