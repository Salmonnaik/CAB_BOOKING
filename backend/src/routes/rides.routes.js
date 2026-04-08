const express = require("express");
const router = express.Router();

const { requestRide, getRides } = require("../controllers/ride.controller");

// POST /request-ride → assign nearest available driver
router.post("/request-ride", requestRide);

// GET /rides → ride history
router.get("/rides", getRides);

module.exports = router;

