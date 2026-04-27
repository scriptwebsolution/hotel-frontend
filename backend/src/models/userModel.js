const crypto = require("crypto");
const pool = require("../config/db");

const PUBLIC_COLUMNS = "id, name, email, role, created_at, updated_at";

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role, created_at, updated_at
     FROM users WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
};

const create = async ({ name, email, passwordHash, role = "guest" }) => {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [id, name, email, passwordHash, role]
  );
  return findById(id);
};

const list = async ({ limit = 50, offset = 0 } = {}) => {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
};

module.exports = {
  findById,
  findByEmail,
  create,
  list,
};
