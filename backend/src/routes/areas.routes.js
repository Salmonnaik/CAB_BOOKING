const express = require("express");
const router = express.Router();

const { getAreas } = require("../controllers/areas.controller");

// GET /areas → list all Hyderabad areas
router.get("/", getAreas);

module.exports = router;

