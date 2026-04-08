const {
  getAllDrivers,
  insertDriver,
  resetAllDriversAvailability,
} = require("../db/db");

async function addDriver({ name, area }) {
  return insertDriver({ name, area });
}

async function listDrivers() {
  return getAllDrivers();
}

async function resetDriversAvailability() {
  const resetCount = resetAllDriversAvailability();
  return { resetCount };
}

module.exports = {
  addDriver,
  listDrivers,
  resetDriversAvailability,
};

