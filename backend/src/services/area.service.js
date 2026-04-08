// Predefined Hyderabad areas (human-friendly inputs/outputs).
// NOTE: We keep an internal area -> (lat,lng) mapping for distance calculation only.

const AREAS = [
  "Banjara Hills",
  "Jubilee Hills",
  "Gachibowli",
  "Hitech City",
  "Madhapur",
  "Kukatpally",
  "Miyapur",
  "Ameerpet",
  "Begumpet",
  "Secunderabad",
  "Somajiguda",
  "Kondapur",
  "Manikonda",
  "LB Nagar",
  "Dilsukhnagar",
  "Charminar",
  "Mehdipatnam",
  "Tolichowki",
  "Uppal",
  "Tarnaka",
  "ECIL",
  "Shamshabad",
  "Nagole",
  "Nampally",
  "Abids",
];

// Approximate representative coordinates per area (internal, hidden from API/Frontend).
// These are used only for nearest-driver distance computation.
const AREA_TO_COORDS = {
  "Banjara Hills": { lat: 17.432, lng: 78.451 },
  "Jubilee Hills": { lat: 17.427, lng: 78.449 },
  Gachibowli: { lat: 17.449, lng: 78.338 },
  "Hitech City": { lat: 17.444, lng: 78.34 },
  Madhapur: { lat: 17.441, lng: 78.385 },
  Kukatpally: { lat: 17.489, lng: 78.399 },
  Miyapur: { lat: 17.495, lng: 78.348 },
  Ameerpet: { lat: 17.441, lng: 78.437 },
  Begumpet: { lat: 17.453, lng: 78.463 },
  Secunderabad: { lat: 17.438, lng: 78.511 },
  Somajiguda: { lat: 17.421, lng: 78.456 },
  Kondapur: { lat: 17.463, lng: 78.361 },
  Manikonda: { lat: 17.448, lng: 78.393 },
  "LB Nagar": { lat: 17.345, lng: 78.486 },
  Dilsukhnagar: { lat: 17.366, lng: 78.508 },
  Charminar: { lat: 17.36, lng: 78.475 },
  Mehdipatnam: { lat: 17.371, lng: 78.45 },
  Tolichowki: { lat: 17.41, lng: 78.441 },
  Uppal: { lat: 17.332, lng: 78.541 },
  Tarnaka: { lat: 17.387, lng: 78.541 },
  ECIL: { lat: 17.461, lng: 78.579 },
  Shamshabad: { lat: 17.244, lng: 78.437 },
  Nagole: { lat: 17.395, lng: 78.532 },
  Nampally: { lat: 17.387, lng: 78.486 },
  Abids: { lat: 17.391, lng: 78.478 },
};

function getAllAreas() {
  return [...AREAS];
}

function isValidArea(area) {
  return typeof area === "string" && Object.prototype.hasOwnProperty.call(AREA_TO_COORDS, area);
}

function getAreaCoords(area) {
  if (!isValidArea(area)) {
    throw new Error(`Unknown area: ${area}`);
  }
  return AREA_TO_COORDS[area];
}

module.exports = {
  getAllAreas,
  isValidArea,
  getAreaCoords,
};

