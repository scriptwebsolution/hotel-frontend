const pool = require("../config/db");

// Helper to execute single value queries
const fetchValue = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : 0;
};

const getStats = async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 1. Today Booking (count of bookings created today)
  const todayBooking = await fetchValue(
    `SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = ?`,
    [today]
  );

  // 2. Total Amount (Total Revenue from all non-cancelled bookings)
  const totalAmount = await fetchValue(
    `SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status != 'cancelled'`
  );

  // 3. Total Customer (count of users with role guest)
  const totalCustomer = await fetchValue(
    `SELECT COUNT(*) FROM users WHERE role = 'guest'`
  );

  // 4. Total Booking (all time total bookings)
  const totalBooking = await fetchValue(`SELECT COUNT(*) FROM bookings`);

  // Additional stats requested
  const checkinsToday = await fetchValue(
    `SELECT COUNT(*) FROM bookings WHERE check_in = ? AND status IN ('confirmed', 'completed')`,
    [today]
  );

  const checkoutsToday = await fetchValue(
    `SELECT COUNT(*) FROM bookings WHERE check_out = ? AND status IN ('confirmed', 'completed')`,
    [today]
  );

  const pendingBookings = await fetchValue(
    `SELECT COUNT(*) FROM bookings WHERE status = 'pending'`
  );

  const cancelledBookings = await fetchValue(
    `SELECT COUNT(*) FROM bookings WHERE status = 'cancelled'`
  );

  return {
    todayBooking,
    totalAmount: parseFloat(totalAmount),
    totalCustomer,
    totalBooking,
    checkinsToday,
    checkoutsToday,
    pendingBookings,
    cancelledBookings,
  };
};

const getAnalytics = async () => {
  // A. Reservation Trend Line Chart (Last 12 months)
  const [trendRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b-%y') AS month_label,
      MONTH(created_at) as m, YEAR(created_at) as y,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
    FROM bookings
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY y, m, month_label
    ORDER BY y ASC, m ASC
  `);

  // B. Booking Status Pie / Donut Chart
  const [statusRows] = await pool.query(`
    SELECT status, COUNT(*) AS count
    FROM bookings
    GROUP BY status
  `);
  
  const statusDistribution = statusRows.map((r) => ({
    name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
    value: r.count,
  }));

  // C. Revenue vs Bookings Bar Graph (Last 12 months)
  const [revenueRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b-%y') AS month_label,
      MONTH(created_at) as m, YEAR(created_at) as y,
      COALESCE(SUM(total_price), 0) AS revenue,
      COUNT(*) AS totalBookings
    FROM bookings
    WHERE status != 'cancelled'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY y, m, month_label
    ORDER BY y ASC, m ASC
  `);

  // D. Customer Activity Graph (New users per month for last 12 months)
  const [customerRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%b-%y') AS month_label,
      MONTH(created_at) as m, YEAR(created_at) as y,
      COUNT(*) AS newCustomers
    FROM users
    WHERE role = 'guest'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY y, m, month_label
    ORDER BY y ASC, m ASC
  `);

  return {
    reservationTrend: trendRows,
    bookingStatus: statusDistribution,
    revenueVsBookings: revenueRows.map((r) => ({
      ...r,
      revenue: parseFloat(r.revenue),
    })),
    customerActivity: customerRows,
  };
};

module.exports = {
  getStats,
  getAnalytics,
};
