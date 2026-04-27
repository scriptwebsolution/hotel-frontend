const crypto = require("crypto");
const pool = require("../config/db");

const PUBLIC_COLUMNS =
  "id, name, email, role, avatar_url, google_id, created_at, updated_at";

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role, avatar_url, google_id,
            created_at, updated_at
     FROM users WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
};

const findByGoogleId = async (googleId) => {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE google_id = ?`,
    [googleId]
  );
  return rows[0] || null;
};

const create = async ({
  name,
  email,
  passwordHash = null,
  googleId = null,
  avatarUrl = null,
  role = "guest",
}) => {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, google_id, avatar_url, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, passwordHash, googleId, avatarUrl, role]
  );
  return findById(id);
};

const linkGoogleAccount = async (id, { googleId, avatarUrl }) => {
  await pool.query(
    `UPDATE users
       SET google_id = ?,
           avatar_url = COALESCE(?, avatar_url)
     WHERE id = ?`,
    [googleId, avatarUrl, id]
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
  findByGoogleId,
  create,
  linkGoogleAccount,
  list,
};
