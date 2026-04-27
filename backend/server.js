const app = require("./src/app");
const env = require("./src/config/env");
const pool = require("./src/config/db");

const start = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connection verified.");
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`Backend server listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
      } catch (e) {
        console.error("Error closing pool:", e);
      }
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
  });
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    shutdown("uncaughtException");
  });
};

start();
