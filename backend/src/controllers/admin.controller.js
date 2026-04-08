const { HttpError } = require("../utils/httpError");
const { clearAllDriversAndRides, disableSeeding, getAllDrivers, getAllRides } = require("../db/db");

async function resetAll(_req, res) {
  // Clears everything and prevents automatic reseeding on next restart.
  try {
    disableSeeding();
    const { clearedDrivers, clearedRides } = clearAllDriversAndRides();
    const drivers = getAllDrivers();
    const rides = getAllRides();

    return res.json({
      ok: true,
      clearedDrivers,
      clearedRides,
      driversCount: drivers.length,
      ridesCount: rides.length,
    });
  } catch (e) {
    throw new HttpError(500, "Failed to reset data.", { message: e.message || String(e) });
  }
}

module.exports = { resetAll };

