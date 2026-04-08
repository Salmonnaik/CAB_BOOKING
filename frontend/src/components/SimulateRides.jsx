import React, { useState } from "react";
import { apiRequestRide } from "../api";

export default function SimulateRides({ areas, onRideAssigned, onDriversRefresh }) {
  const [count, setCount] = useState(5);
  const [delayMs, setDelayMs] = useState(250);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  async function handleSimulate() {
    setLoading(true);
    setError(null);
    setResults([]);
    const areaList = areas || [];

    try {
      let lastSuccessful = null;
      if (areaList.length === 0) {
        setError("No areas loaded yet.");
        return null;
      }

      for (let i = 0; i < count; i += 1) {
        // Choose a random pickup area from the allowed Hyderabad list.
        const pickupArea = areaList[Math.floor(Math.random() * areaList.length)];
        const requesterName = `SimUser-${i + 1}`;

        try {
          const res = await apiRequestRide({
            user_area: pickupArea,
            requester_name: requesterName,
          });
          lastSuccessful = res;
          setResults((prev) => [
            ...prev,
            {
              idx: i + 1,
              requester_name: requesterName,
              user_area: pickupArea,
              driver: res.driver,
              nearestDistanceKm: res.nearestDistanceKm,
            },
          ]);

          if (onRideAssigned) onRideAssigned(res);
        } catch (err) {
          setError(err.message || "Simulation failed.");
          break; // Stop when no available drivers remain.
        }

        if (delayMs > 0) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }

      if (onDriversRefresh) await onDriversRefresh();
      return lastSuccessful;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="title">Simulate Multiple Rides</h2>

      <div className="row">
        <div className="field">
          <label>Number of ride requests</label>
          <input
            value={count}
            type="number"
            min={1}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Delay between requests (ms)</label>
          <input
            value={delayMs}
            type="number"
            min={0}
            step="50"
            onChange={(e) => setDelayMs(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button disabled={loading} type="button" onClick={handleSimulate}>
          {loading ? "Simulating..." : "Simulate Rides"}
        </button>
      </div>

      {error ? <div className="error">{error}</div> : null}

      {results.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          <div className="status">
            Completed {results.length}/{count} request(s). (Stops when no drivers are available.)
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Requester</th>
                <th>Assigned Driver</th>
                <th>Pickup Area</th>
                <th>Driver Area</th>
                <th>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.idx}>
                  <td className="mono">{r.idx}</td>
                  <td className="mono">{r.requester_name}</td>
                  <td>
                    <span className="mono">
                      #{r.driver.id} {r.driver.name}
                    </span>
                  </td>
                  <td className="mono">{r.user_area}</td>
                  <td className="mono">{r.driver.area}</td>
                  <td className="mono">{Number(r.nearestDistanceKm).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

