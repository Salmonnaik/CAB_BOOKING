import React, { useEffect, useState } from "react";
import { apiGetAreas, apiGetDrivers, apiResetDriversAvailability, apiGetRides } from "./api";
import AddDriverForm from "./components/AddDriverForm";
import DriverList from "./components/DriverList";
import RequestRideForm from "./components/RequestRideForm";
import RideResult from "./components/RideResult";
import SimulateRides from "./components/SimulateRides";

export default function App() {
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driversError, setDriversError] = useState(null);

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [areasError, setAreasError] = useState(null);

  const [highlightedDriverId, setHighlightedDriverId] = useState(null);
  const [rideResult, setRideResult] = useState(null);

  const [recentRides, setRecentRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [ridesError, setRidesError] = useState(null);

  async function fetchDrivers() {
    setLoadingDrivers(true);
    setDriversError(null);
    try {
      const res = await apiGetDrivers();
      setDrivers(res.drivers || []);
    } catch (err) {
      setDriversError(err.message || "Failed to fetch drivers.");
    } finally {
      setLoadingDrivers(false);
    }
  }

  async function fetchAreas() {
    setAreasLoading(true);
    setAreasError(null);
    try {
      const res = await apiGetAreas();
      setAreas(res.areas || []);
    } catch (err) {
      setAreasError(err.message || "Failed to fetch areas.");
    } finally {
      setAreasLoading(false);
    }
  }

  async function fetchRideHistory() {
    setRidesLoading(true);
    setRidesError(null);
    try {
      const res = await apiGetRides();
      setRecentRides((res.rides || []).slice(0, 8));
    } catch (err) {
      setRidesError(err.message || "Failed to fetch rides.");
    } finally {
      setRidesLoading(false);
    }
  }

  useEffect(() => {
    fetchDrivers();
    fetchAreas();
  }, []);

  async function handleResetAvailability() {
    setDriversError(null);
    try {
      await apiResetDriversAvailability();
      setHighlightedDriverId(null);
      setRideResult(null);
      await fetchDrivers();
    } catch (err) {
      setDriversError(err.message || "Failed to reset availability.");
    }
  }

  return (
    <div className="container">
      <h1>Cab Booking System</h1>
      <p className="status">
        Hyderabad areas: backend assigns the nearest available driver using internal distance logic.
      </p>

      <div className="grid">
        <div className="card">
          <AddDriverForm areas={areas} onAdded={fetchDrivers} />
        </div>

        <div className="card">
          <RequestRideForm
            areas={areas}
            onRideAssigned={async (res) => {
              setRideResult(res);
              setHighlightedDriverId(res.driver.id);
              await fetchDrivers();
            }}
          />

          <div style={{ marginTop: 14 }}>
            <RideResult result={rideResult} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className="title" style={{ marginBottom: 0 }}>
              Drivers & Availability
            </h2>
            <div className="status">Assigned driver is highlighted after a successful booking.</div>
          </div>
          <div className="row">
            <button
              className="btnSecondary"
              type="button"
              onClick={handleResetAvailability}
              disabled={loadingDrivers}
            >
              Reset Drivers Availability
            </button>
          </div>
        </div>

        {loadingDrivers ? <div className="status">Loading drivers...</div> : null}
        {driversError ? <div className="error">{driversError}</div> : null}
        {areasLoading ? <div className="status">Loading areas...</div> : null}
        {areasError ? <div className="error">{areasError}</div> : null}

        <DriverList drivers={drivers} highlightedDriverId={highlightedDriverId} />

        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btnSecondary"
            onClick={fetchRideHistory}
            disabled={ridesLoading}
          >
            {ridesLoading ? "Loading Ride History..." : "Load Ride History"}
          </button>
          {ridesError ? <div className="error">{ridesError}</div> : null}

          {recentRides.length > 0 ? (
            <div style={{ marginTop: 10 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRides.map((r) => (
                    <tr key={r.id}>
                      <td className="mono">{r.id}</td>
                      <td>
                        <span className="mono">
                          #{r.driver_id} {r.driver_name} ({r.driver_area})
                        </span>
                      </td>
                      <td className="mono">{r.status}</td>
                      <td className="mono">{r.user_area}</td>
                      <td className="mono">{r.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <SimulateRides
          areas={areas}
          onRideAssigned={(res) => {
            setRideResult(res);
            setHighlightedDriverId(res.driver.id);
          }}
          onDriversRefresh={fetchDrivers}
        />
      </div>
    </div>
  );
}

