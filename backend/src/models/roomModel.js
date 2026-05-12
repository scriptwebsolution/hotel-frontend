const crypto = require("crypto");
const pool = require("../config/db");

const COLUMNS =
  "id, room_number, type, price_per_night, capacity, description, is_active, created_at, updated_at";

const mapRoom = (row) => {
  if (!row) return row;
  return {
    ...row,
    price_per_night: Number(row.price_per_night),
    is_active: Boolean(row.is_active),
  };
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM rooms WHERE id = ?`,
    [id]
  );
  return mapRoom(rows[0]) || null;
};

const findByRoomNumber = async (roomNumber) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM rooms WHERE room_number = ?`,
    [roomNumber]
  );
  return mapRoom(rows[0]) || null;
};

const list = async ({ activeOnly = true, limit = 100, offset = 0 } = {}) => {
  const where = activeOnly ? "WHERE is_active = 1" : "";
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM rooms ${where}
     ORDER BY room_number ASC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows.map(mapRoom);
};

const create = async ({
  roomNumber,
  type,
  pricePerNight,
  capacity = 1,
  description = null,
  isActive = true,
}) => {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO rooms (id, room_number, type, price_per_night, capacity, description, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, roomNumber, type, pricePerNight, capacity, description, isActive ? 1 : 0]
  );
  return findById(id);
};

const update = async (id, fields) => {
  const allowed = {
    room_number: fields.roomNumber,
    type: fields.type,
    price_per_night: fields.pricePerNight,
    capacity: fields.capacity,
    description: fields.description,
    is_active:
      fields.isActive === undefined ? undefined : fields.isActive ? 1 : 0,
  };

  const sets = [];
  const values = [];
  for (const [col, val] of Object.entries(allowed)) {
    if (val === undefined) continue;
    sets.push(`${col} = ?`);
    values.push(val);
  }

  if (!sets.length) return findById(id);

  sets.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  await pool.query(
    `UPDATE rooms SET ${sets.join(", ")} WHERE id = ?`,
    values
  );
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.query(`DELETE FROM rooms WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

const findAvailable = async ({ checkIn, checkOut, capacity = 1 }) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS}
     FROM rooms r
     WHERE r.is_active = 1
       AND r.capacity >= ?
       AND NOT EXISTS (
         SELECT 1 FROM bookings b
         WHERE b.room_id = r.id
           AND b.status IN ('pending', 'confirmed')
           AND b.check_in < ?
           AND b.check_out > ?
       )
     ORDER BY r.price_per_night ASC`,
    [Number(capacity), checkOut, checkIn]
  );
  return rows.map(mapRoom);
};

module.exports = {
  findById,
  findByRoomNumber,
  list,
  create,
  update,
  remove,
  findAvailable,
};
