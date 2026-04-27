const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hotel_db",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-insecure-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

module.exports = env;
