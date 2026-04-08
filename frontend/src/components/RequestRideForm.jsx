import React, { useEffect, useState } from "react";
import { apiRequestRide } from "../api";

export default function RequestRideForm({ areas, onRideAssigned }) {
  const [userArea, setUserArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (areas && areas.length > 0 && !userArea) {
      setUserArea(areas[0]);
    }
  }, [areas, userArea]);

  async function handleRequest(e) {
    e.preventDefault();
    setError(null);

    if (!userArea) {
      setError("Please select a pickup area.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequestRide({ user_area: userArea });
      if (onRideAssigned) onRideAssigned(result);
    } catch (err) {
      setError(err.message || "Ride request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="title">Request Ride</h2>
      <form onSubmit={handleRequest}>
        <div className="field">
          <label>Pickup Area</label>
          <select
            value={userArea}
            onChange={(e) => setUserArea(e.target.value)}
            style={{ padding: 10, borderRadius: 8 }}
          >
            <option value="" disabled>
              Select an area
            </option>
            {(areas || []).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 12 }}>
          <button disabled={loading} type="submit">
            {loading ? "Requesting..." : "Request Nearest Driver"}
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="status">
          The backend scans all <span className="mono">available</span> drivers and assigns the nearest one by distance computed internally from the selected areas.
        </div>
      </form>
    </div>
  );
}

