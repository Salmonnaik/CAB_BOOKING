const { HttpError } = require("../utils/httpError");
const { assignNearestAvailableDriver, listRides } = require("../services/ride.service");
const { isValidArea } = require("../services/area.service");

function requireNonEmptyString(value) {
  if (typeof value !== "string") return false;
  if (!value.trim()) return false;
  if (value.trim().length > 80) return false;
  return true;
}

async function requestRide(req, res) {
  const { user_area, requester_name } = req.body || {};

  if (!requireNonEmptyString(user_area) || !isValidArea(user_area)) {
    throw new HttpError(400, "Invalid `user_area` (must be a Hyderabad area).", {
      expected: { user_area: "string from /areas" },
    });
  }

  if (!requireNonEmptyString(requester_name)) {
    throw new HttpError(400, "Invalid `requester_name` (string, 1-80 chars).", {
      expected: { requester_name: "string (1-80 chars)" },
    });
  }

  const result = await assignNearestAvailableDriver({
    user_area,
    requester_name: requester_name.trim(),
  });

  return res.status(201).json(result);
}

async function getRides(_req, res) {
  const rides = await listRides();
  return res.json({ rides });
}

module.exports = { requestRide, getRides };

