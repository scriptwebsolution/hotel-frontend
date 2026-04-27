const crypto = require("crypto");
const pool = require("../config/db");

const COLUMNS =
  "id, user_id, room_id, check_in, check_out, guests, total_price, status, created_at, updated_at";

const mapBooking = (row) => {
  if (!row) return row;
  return {
    ...row,
    total_price: Number(row.total_price),
  };
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM bookings WHERE id = ?`,
    [id]
  );
  return mapBooking(rows[0]) || null;
};

const listForUser = async (userId, { limit = 50, offset = 0 } = {}) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM bookings
     WHERE user_id = ?
     ORDER BY check_in DESC
     LIMIT ? OFFSET ?`,
    [userId, Number(limit), Number(offset)]
  );
  return rows.map(mapBooking);
};

const listAll = async ({ limit = 100, offset = 0, status } = {}) => {
  const params = [];
  let where = "";
  if (status) {
    where = "WHERE status = ?";
    params.push(status);
  }
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM bookings ${where}
     ORDER BY check_in DESC
     LIMIT ? OFFSET ?`,
    params
  );
  return rows.map(mapBooking);
};

/**
 * Concurrency-safe booking creation.
 * - Opens a transaction.
 * - Uses SELECT ... FOR UPDATE on the indexed (room_id, check_in, check_out)
 *   range to acquire gap locks under InnoDB REPEATABLE READ, blocking any
 *   parallel transaction from inserting an overlapping booking.
 * - Returns null if the slot is already taken.
 */
const createWithOverlapGuard = async ({
  userId,
  roomId,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  status = "confirmed",
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [conflicts] = await conn.query(
      `SELECT id FROM bookings
       WHERE room_id = ?
         AND status IN ('pending', 'confirmed')
         AND check_in < ?
         AND check_out > ?
       FOR UPDATE`,
      [roomId, checkOut, checkIn]
    );

    if (conflicts.length > 0) {
      await conn.rollback();
      return null;
    }

    const id = crypto.randomUUID();
    await conn.query(
      `INSERT INTO bookings
         (id, user_id, room_id, check_in, check_out, guests, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, roomId, checkIn, checkOut, guests, totalPrice, status]
    );

    const [rows] = await conn.query(
      `SELECT ${COLUMNS} FROM bookings WHERE id = ?`,
      [id]
    );

    await conn.commit();
    return mapBooking(rows[0]);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const updateStatus = async (id, status) => {
  const [result] = await pool.query(
    `UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, id]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.query(`DELETE FROM bookings WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findById,
  listForUser,
  listAll,
  createWithOverlapGuard,
  updateStatus,
  remove,
};
