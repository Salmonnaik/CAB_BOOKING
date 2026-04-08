import React from "react";

export default function RideResult({ result }) {
  if (!result) return <div className="status">Request a ride to see the result.</div>;

  const { ride, driver, nearestDistanceKm, estimatedTripKm } = result;
  return (
    <div>
      <h2 className="title">Ride Result</h2>
      <div className="status">
        Ride ID: <span className="mono">{ride.id}</span> | Status: <span className="mono">{ride.status}</span>
      </div>
      <div className="status" style={{ marginTop: 8 }}>
        Requester: <span className="mono">{ride.requester_name || "—"}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        Assigned Driver:{" "}
        <span className="mono">
          #{driver.id} {driver.name}
        </span>
      </div>
      <div className="status" style={{ marginTop: 8 }}>
        Driver area: <span className="mono">{driver.area}</span>
      </div>
      <div className="status" style={{ marginTop: 8 }}>
        Nearest distance: <span className="mono">{Number(nearestDistanceKm).toFixed(2)}</span> km (approx)
      </div>
      <div className="status" style={{ marginTop: 8 }}>
        Estimated trip: <span className="mono">{Number(estimatedTripKm).toFixed(2)}</span> km (fake)
      </div>
      <div className="status" style={{ marginTop: 8 }}>
        Pickup area: <span className="mono">{ride.user_area}</span>
      </div>
    </div>
  );
}

