const {
  getAvailableDrivers,
  setDriverAvailability,
  insertRide,
  getAllRides,
} = require("../db/db");
const { calculateDistance } = require("./distance.service");
const { HttpError } = require("../utils/httpError");
const { getAreaCoords } = require("./area.service");

async function assignNearestAvailableDriver({ user_area }) {
  const availableDrivers = getAvailableDrivers();

  if (!availableDrivers || availableDrivers.length === 0) {
    throw new HttpError(409, "No available drivers right now. Try resetting drivers availability.", {
      availableCount: 0,
    });
  }

  const userCoords = getAreaCoords(user_area);

  // Nearest search (DSA-style): brute-force scan of available drivers.
  // Complexity: O(n) per request, where n = number of available drivers.
  let nearest = null;

  for (const driver of availableDrivers) {
    const driverCoords = getAreaCoords(driver.area);

    const { distanceKm } = calculateDistance(
      userCoords.lat,
      userCoords.lng,
      driverCoords.lat,
      driverCoords.lng
    );

    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = {
        driver,
        distanceKm,
      };
    }
  }

  // Reuse validation error shape if something goes wrong.
  if (!nearest) {
    throw new HttpError(500, "Failed to assign a driver.");
  }

  // Mark driver as unavailable.
  setDriverAvailability(nearest.driver.id, 0);

  // Ensure response matches the updated availability state.
  const assignedDriver = {
    ...nearest.driver,
    available: 0,
  };

  // Store assignment into ride history.
  const ride = insertRide({
    user_area,
    driver_id: nearest.driver.id,
    status: "assigned",
  });

  return {
    ride,
    driver: assignedDriver,
    nearestDistanceKm: nearest.distanceKm,
  };
}

async function listRides() {
  return getAllRides();
}

module.exports = {
  assignNearestAvailableDriver,
  listRides,
};

