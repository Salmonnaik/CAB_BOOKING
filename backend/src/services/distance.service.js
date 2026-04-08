/**
 * Distance calculation per requirement:
 * sqrt((x2-x1)^2 + (y2-y1)^2) where:
 *   x = latitude, y = longitude
 *
 * Note: lat/lng are degrees, so the raw distance is in "degree-units".
 * For UI readability we convert degrees -> approx kilometers.
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;

  const distanceDeg = Math.sqrt(dx * dx + dy * dy);

  // Approx conversion: 1 degree latitude ~= 111.32 km.
  // This is an approximation (longitude degrees shrink with latitude),
  // but it keeps the demo intuitive.
  const distanceKm = distanceDeg * 111.32;

  return { distanceKm };
}

module.exports = { calculateDistance };

