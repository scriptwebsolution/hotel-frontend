const pool = require("./db");

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    google_id VARCHAR(64) NULL UNIQUE,
    avatar_url VARCHAR(512) NULL,
    role ENUM('guest', 'staff', 'admin') NOT NULL DEFAULT 'guest',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS rooms (
    id CHAR(36) NOT NULL PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(40) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    description TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_rooms_price CHECK (price_per_night >= 0),
    CONSTRAINT chk_rooms_capacity CHECK (capacity > 0)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    room_id CHAR(36) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bookings_room_dates (room_id, check_in, check_out),
    INDEX idx_bookings_user (user_id),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
    CONSTRAINT chk_bookings_dates CHECK (check_out > check_in),
    CONSTRAINT chk_bookings_guests CHECK (guests > 0),
    CONSTRAINT chk_bookings_total CHECK (total_price >= 0)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

const columnExists = async (table, column) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return rows[0].c > 0;
};

const ensureUsersAuthColumns = async () => {
  if (!(await columnExists("users", "google_id"))) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN google_id VARCHAR(64) NULL UNIQUE"
    );
  }
  if (!(await columnExists("users", "avatar_url"))) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512) NULL"
    );
  }

  await pool.query(
    "ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL"
  );
};

const initSchema = async () => {
  for (const sql of STATEMENTS) {
    await pool.query(sql);
  }
  await ensureUsersAuthColumns();
};

if (require.main === module) {
  (async () => {
    try {
      await initSchema();
      console.log("MySQL schema initialized successfully.");
      process.exit(0);
    } catch (err) {
      console.error("Failed to initialize schema:", err);
      process.exit(1);
    }
  })();
}

module.exports = { initSchema };
