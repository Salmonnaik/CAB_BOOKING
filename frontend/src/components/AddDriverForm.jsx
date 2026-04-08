import React, { useEffect, useState } from "react";
import { apiAddDriver } from "../api";

export default function AddDriverForm({ areas, onAdded }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (areas && areas.length > 0 && !area) {
      setArea(areas[0]);
    }
  }, [areas, area]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Driver name is required.");
      return;
    }

    if (!area) {
      setError("Please select a driver area.");
      return;
    }

    setLoading(true);
    try {
      await apiAddDriver({
        name: name.trim(),
        area,
      });
      setName("");
      setArea("");
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.message || "Failed to add driver.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="title">Add Driver</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Driver Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Driver X" />
        </div>
        <div className="field">
          <label>Driver Area</label>
          <select value={area} onChange={(e) => setArea(e.target.value)} style={{ padding: 10, borderRadius: 8 }}>
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
            {loading ? "Adding..." : "Add Driver"}
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="status">
          Tip: Choose a Hyderabad area. Distance matching is computed internally from the selected areas.
        </div>
      </form>
    </div>
  );
}

