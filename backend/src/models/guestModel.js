const crypto = require("crypto");
const pool = require("../config/db");

const COLUMNS =
  "id, name, email, phone, address, id_proof_type, id_proof_number, created_at, updated_at";

const mapGuest = (row) => {
  if (!row) return row;
  return { ...row };
};

const getAll = async ({ search = "", limit = 100, offset = 0 } = {}) => {
  const params = [];
  let where = "";

  if (search) {
    where = "WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?";
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM guests ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    params
  );
  return rows.map(mapGuest);
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM guests WHERE id = ?`,
    [id]
  );
  return mapGuest(rows[0]) || null;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM guests WHERE email = ?`,
    [email]
  );
  return mapGuest(rows[0]) || null;
};

const findByPhone = async (phone) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM guests WHERE phone = ?`,
    [phone]
  );
  return mapGuest(rows[0]) || null;
};

const create = async ({
  name,
  email,
  phone,
  address = null,
  idProofType = null,
  idProofNumber = null,
}) => {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO guests (id, name, email, phone, address, id_proof_type, id_proof_number)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, address, idProofType, idProofNumber]
  );
  return getById(id);
};

const update = async (id, fields) => {
  const allowed = {
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    address: fields.address,
    id_proof_type: fields.idProofType,
    id_proof_number: fields.idProofNumber,
  };

  const sets = [];
  const values = [];
  for (const [col, val] of Object.entries(allowed)) {
    if (val === undefined) continue;
    sets.push(`${col} = ?`);
    values.push(val);
  }

  if (!sets.length) return getById(id);

  sets.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await pool.query(
    `UPDATE guests SET ${sets.join(", ")} WHERE id = ?`,
    values
  );
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query(`DELETE FROM guests WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAll,
  getById,
  findByEmail,
  findByPhone,
  create,
  update,
  remove,
};
