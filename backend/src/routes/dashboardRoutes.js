const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate); // Secure all dashboard routes

router.get("/stats", dashboardController.getStats);
router.get("/analytics", dashboardController.getAnalytics);

module.exports = router;
