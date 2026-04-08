import React from "react";

export default function DriverList({ drivers, highlightedDriverId }) {
  return (
    <div>
      <h2 className="title">Drivers</h2>
      {(!drivers || drivers.length === 0) ? (
        <div className="status">No drivers yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Area</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => {
              const isAssigned = highlightedDriverId != null && d.id === highlightedDriverId;
              const available = d.available === 1;
              return (
                <tr
                  key={d.id}
                  className={isAssigned ? "assignedRow" : undefined}
                  title={isAssigned ? "This driver was assigned most recently." : undefined}
                >
                  <td className="mono">{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.area}</td>
                  <td>
                    <span className={`pill ${available ? "pillAvailable" : "pillUnavailable"}`}>
                      {available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

