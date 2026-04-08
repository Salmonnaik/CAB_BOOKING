const { getAllDrivers, insertDriver } = require("../db/db");

function getHyderabadSeedDrivers() {
  // Area-based seed drivers (no coordinates exposed anywhere).
  return [
    { name: "Driver A", area: "Banjara Hills" },
    { name: "Driver B", area: "Jubilee Hills" },
    { name: "Driver C", area: "Gachibowli" },
    { name: "Driver D", area: "Hitech City" },
    { name: "Driver E", area: "Madhapur" },
    { name: "Driver F", area: "Kondapur" },
    { name: "Driver G", area: "Kukatpally" },
    { name: "Driver H", area: "Ameerpet" },
    { name: "Driver I", area: "Secunderabad" },
    { name: "Driver J", area: "Miyapur" },
    { name: "Driver K", area: "Begumpet" },
    { name: "Driver L", area: "Somajiguda" },
    { name: "Driver M", area: "Charminar" },
    { name: "Driver N", area: "Mehdipatnam" },
    { name: "Driver O", area: "LB Nagar" },
  ];
}

async function seedDriversIfEmpty() {
  const existing = getAllDrivers();
  const drivers = getHyderabadSeedDrivers();

  if (existing.length > 0) {
    // If schema upgrades already seeded some drivers, fill the missing ones.
    const existingNames = new Set(existing.map((d) => d.name));
    for (const d of drivers) {
      if (!existingNames.has(d.name)) insertDriver(d);
    }
    return;
  }

  for (const d of drivers) {
    insertDriver(d);
  }
}

module.exports = { seedDriversIfEmpty };

