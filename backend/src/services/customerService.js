const pool = require("../config/db");

const getCustomers = async ({ limit = 100, offset = 0 } = {}) => {
  // Fetch users with role = 'guest' and their total unpaid/pending balance
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.created_at,
            COALESCE(SUM(CASE WHEN b.status = 'pending' THEN b.total_price ELSE 0 END), 0) as balance
     FROM users u
     LEFT JOIN bookings b ON u.id = b.user_id
     WHERE u.role = 'guest'
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  return rows.map(r => {
    const parts = r.name.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    
    return {
      id: r.id,
      firstName: firstName || "",
      lastName: lastName || "",
      email: r.email,
      phone: "", // Placeholder as per requirements
      balance: Number(r.balance),
      created_at: r.created_at
    };
  });
};

const getGuests = async ({ limit = 100, offset = 0 } = {}) => {
  // Fetch bookings and join with user to get guest info
  const [rows] = await pool.query(
    `SELECT b.id as booking_id, b.room_id, b.check_in, b.check_out, b.status, 
            u.id as user_id, u.name as guest_name, u.email
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  return rows.map((r, index) => {
    // Generate a formatted booking number, e.g. "00000009"
    // Using simple logic here; could be improved if actual sequential numbers exist
    const bookingNumber = String(index + 1).padStart(8, '0');

    return {
      id: r.booking_id,
      bookingNumber: bookingNumber,
      guestName: r.guest_name,
      gender: "", // Placeholder
      mobile: "", // Placeholder
      email: r.email,
      identityType: "", // Placeholder
      idNumber: "", // Placeholder
      status: r.status
    };
  });
};

module.exports = {
  getCustomers,
  getGuests
};
