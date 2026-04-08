const { HttpError } = require("../utils/httpError");
const {
  addDriver,
  listDrivers,
  resetDriversAvailability,
} = require("../services/drivers.service");
const { isValidArea } = require("../services/area.service");

function requireNonEmptyString(value) {
  if (typeof value !== "string") return false;
  if (!value.trim()) return false;
  if (value.trim().length > 80) return false;
  return true;
}

async function getDrivers(req, res) {
  const drivers = await listDrivers();
  return res.json({ drivers });
}

async function postDrivers(req, res) {
  const { name, area } = req.body || {};

  if (!requireNonEmptyString(name)) {
    throw new HttpError(400, "Invalid `name` (string, 1-80 chars).", {
      expected: { name: "string (1-80 chars)" },
    });
  }

  if (!requireNonEmptyString(area) || !isValidArea(area)) {
    throw new HttpError(400, "Invalid `area` (must be a Hyderabad area).", {
      expected: { area: "string from /areas" },
    });
  }

  const driver = await addDriver({
    name: name.trim(),
    area,
  });

  return res.status(201).json({ driver });
}

async function resetAvailability(req, res) {
  const { resetCount } = await resetDriversAvailability();
  return res.json({ ok: true, resetCount });
}

module.exports = {
  getDrivers,
  postDrivers,
  resetAvailability,
};

