const express = require("express");
const router = express.Router();

const { resetAll } = require("../controllers/admin.controller");

// POST /admin/reset
// Clears all drivers + rides and disables auto-seeding.
router.post("/reset", resetAll);

module.exports = router;

