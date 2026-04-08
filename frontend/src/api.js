const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function parseError(response) {
  try {
    const data = await response.json();
    if (data && data.error) return data.error;
  } catch {
    // ignore
  }
  return `Request failed (${response.status})`;
}

async function requestJson(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const msg = await parseError(response);
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function apiGetDrivers() {
  return requestJson("/drivers", { method: "GET" });
}

export async function apiGetAreas() {
  return requestJson("/areas", { method: "GET" });
}

export async function apiAddDriver({ name, area }) {
  return requestJson("/drivers", {
    method: "POST",
    body: JSON.stringify({ name, area }),
  });
}

export async function apiResetDriversAvailability() {
  return requestJson("/drivers/reset-availability", {
    method: "POST",
  });
}

export async function apiRequestRide({ user_area }) {
  return requestJson("/request-ride", {
    method: "POST",
    body: JSON.stringify({ user_area }),
  });
}

export async function apiGetRides() {
  return requestJson("/rides", { method: "GET" });
}

export async function apiAdminReset() {
  return requestJson("/admin/reset", { method: "POST" });
}

