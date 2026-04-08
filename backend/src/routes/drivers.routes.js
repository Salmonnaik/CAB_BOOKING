const express = require("express");
const router = express.Router();

const {
  getDrivers,
  postDrivers,
  resetAvailability,
} = require("../controllers/drivers.controller");

// GET /drivers → fetch all drivers
router.get("/", getDrivers);

// POST /drivers → add driver
router.post("/", postDrivers);

// Advanced: reset drivers availability
// POST /drivers/reset-availability → set all drivers back to available
router.post("/reset-availability", resetAvailability);

module.exports = router;

