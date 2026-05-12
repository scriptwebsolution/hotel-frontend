const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const roomFacilityRoutes = require("./routes/roomFacilityRoutes");
const guestRoutes = require("./routes/guestRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.disable("x-powered-by");
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== "test") {
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env.nodeEnv });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/room-facilities", roomFacilityRoutes);
app.use("/api/guests", guestRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
