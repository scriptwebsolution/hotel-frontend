const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.status(200).json({ success: true, data: stats });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await dashboardService.getAnalytics();
  res.status(200).json({ success: true, data: analytics });
});

module.exports = {
  getStats,
  getAnalytics,
};
