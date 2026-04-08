const express = require("express");
const cors = require("cors");

const driversRoutes = require("./routes/drivers.routes");
const ridesRoutes = require("./routes/rides.routes");
const areasRoutes = require("./routes/areas.routes");
const adminRoutes = require("./routes/admin.routes");
const { seedDriversIfEmpty } = require("./services/seed.service");
const { initDb } = require("./db/db");

const app = express();

app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/drivers", driversRoutes);
app.use("/areas", areasRoutes);
app.use("/admin", adminRoutes);
app.use("/", ridesRoutes);

// Centralized error handler (keeps controllers/services clean)
// eslint-disable-next-line no-unused-vars
app.use(function errorMiddleware(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const details = err.details;

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(status).json({
    error: message,
    details,
  });
});

// Initialize DB and seed sample drivers on first run.
// This is intentionally done once at app startup.
initDb()
  .then(() => seedDriversIfEmpty())
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize DB:", e);
    process.exit(1);
  });

module.exports = app;

