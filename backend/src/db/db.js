const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

let db;

function getDbPath() {
  return path.join(__dirname, "..", "..", "data", "cab.db");
}

function initSchema(database) {
  const driversExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='drivers' LIMIT 1"
    )
    .get();
  const ridesExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='rides' LIMIT 1"
    )
    .get();

  if (driversExists) {
    const driverCols = database
      .prepare("PRAGMA table_info(drivers)")
      .all()
      .map((c) => c.name);

    const looksLikeOldSchema =
      driverCols.includes("lat") ||
      driverCols.includes("lng") ||
      !driverCols.includes("area");

    if (looksLikeOldSchema) {
      // Demo project: easiest/cleanest way is to reset the schema when upgrading.
      database.exec("DROP TABLE IF EXISTS rides; DROP TABLE IF EXISTS drivers;");
    }
  }

  // If rides exist with the old coordinate columns, also reset them.
  if (ridesExists) {
    const rideCols = database
      .prepare("PRAGMA table_info(rides)")
      .all()
      .map((c) => c.name);

    const looksLikeOldRideSchema =
      rideCols.includes("user_lat") ||
      rideCols.includes("user_lng") ||
      !rideCols.includes("user_area");

    if (looksLikeOldRideSchema) {
      database.exec("DROP TABLE IF EXISTS rides; DROP TABLE IF EXISTS drivers;");
    }
  }

  // Drivers are stored with an available flag and a human-friendly area.
  database.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      available INTEGER NOT NULL DEFAULT 1
    );

    -- Ride/assignment history (area-based)
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_area TEXT NOT NULL,
      driver_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(driver_id) REFERENCES drivers(id)
    );
  `);

  // Indexes for faster lookup (beginner-friendly but production-oriented)
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_drivers_available ON drivers(available);
    CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
    CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
  `);
}

function initDb() {
  if (db) return Promise.resolve(db);

  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  initSchema(db);
  return Promise.resolve(db);
}

function getMetaValue(key) {
  const stmt = db.prepare("SELECT value FROM meta WHERE key = ?");
  const row = stmt.get(key);
  return row ? row.value : null;
}

function setMetaValue(key, value) {
  const existing = getMetaValue(key);
  if (existing === null) {
    db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run(key, value);
    return;
  }
  db.prepare("UPDATE meta SET value = ? WHERE key = ?").run(value, key);
}

function isSeedDisabled() {
  // If "seed_disabled" is set to "1", we never auto-seed.
  return getMetaValue("seed_disabled") === "1";
}

function disableSeeding() {
  setMetaValue("seed_disabled", "1");
}

function clearAllDriversAndRides() {
  const ridesInfo = db.prepare("DELETE FROM rides").run();
  const driversInfo = db.prepare("DELETE FROM drivers").run();
  return {
    clearedRides: ridesInfo.changes || 0,
    clearedDrivers: driversInfo.changes || 0,
  };
}

function getAllDrivers() {
  const stmt = db.prepare(
    "SELECT id, name, area, available FROM drivers ORDER BY id"
  );
  return stmt.all();
}

function getAvailableDrivers() {
  const stmt = db.prepare(
    "SELECT id, name, area, available FROM drivers WHERE available = 1 ORDER BY id"
  );
  return stmt.all();
}

function insertDriver({ name, area }) {
  const stmt = db.prepare(
    "INSERT INTO drivers (name, area, available) VALUES (?, ?, 1)"
  );
  const info = stmt.run(name, area);
  return db
    .prepare("SELECT id, name, area, available FROM drivers WHERE id = ?")
    .get(info.lastInsertRowid);
}

function setDriverAvailability(driverId, available) {
  const stmt = db.prepare(
    "UPDATE drivers SET available = ? WHERE id = ?"
  );
  const info = stmt.run(available, driverId);
  return info.changes;
}

function resetAllDriversAvailability() {
  const stmt = db.prepare("UPDATE drivers SET available = 1 WHERE available = 0");
  const info = stmt.run();
  return info.changes;
}

function insertRide({ user_area, driver_id, status }) {
  const stmt = db.prepare(
    "INSERT INTO rides (user_area, driver_id, status) VALUES (?, ?, ?)"
  );
  const info = stmt.run(user_area, driver_id, status);
  return db
    .prepare(
      `
        SELECT
          r.id,
          r.user_area,
          r.driver_id,
          r.status,
          r.created_at,
          d.name AS driver_name,
          d.area AS driver_area
        FROM rides r
        JOIN drivers d ON d.id = r.driver_id
        WHERE r.id = ?
      `
    )
    .get(info.lastInsertRowid);
}

function getAllRides() {
  const stmt = db.prepare(
    `
      SELECT
        r.id,
        r.user_area,
        r.driver_id,
        d.name AS driver_name,
        d.area AS driver_area,
        r.status,
        r.created_at
      FROM rides r
      JOIN drivers d ON d.id = r.driver_id
      ORDER BY r.id DESC
    `
  );
  return stmt.all();
}

module.exports = {
  initDb,
  getAllDrivers,
  getAvailableDrivers,
  insertDriver,
  setDriverAvailability,
  resetAllDriversAvailability,
  insertRide,
  getAllRides,
  isSeedDisabled,
  disableSeeding,
  clearAllDriversAndRides,
};

