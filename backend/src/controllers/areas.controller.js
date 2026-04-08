const { getAllAreas } = require("../services/area.service");

function getAreas(_req, res) {
  return res.json({ areas: getAllAreas() });
}

module.exports = { getAreas };

