# Cab Assignment System (Uber/Ola-style Demo)

Full-stack demo using:
- **Backend:** Node.js + Express + SQLite (SQL)
- **Frontend:** React + Vite
- **Problem solved:** assign the **nearest available driver** using a distance scan over Hyderabad area locations

## What’s included
1. **Hyderabad context**
   - Backend seeds multiple drivers across a predefined list of Hyderabad areas.
2. **Core features**
   - `POST /drivers` add a driver (name + **area**)
   - `GET /drivers` list all drivers + availability
   - `POST /request-ride` request a ride (pickup area) and allocate nearest available driver
   - `GET /rides` ride history (stored in SQL)
3. **Advanced demo**
   - Frontend highlights the most recently assigned driver
   - Shows nearest driver distance
   - Simulates multiple ride requests
   - Button to reset driver availability

## Data model (SQL)

### `drivers(id, name, area, available)`
- `available` is `1` when the driver can be assigned, otherwise `0`

### `rides(id, user_area, driver_id, status)`
- The backend stores a row whenever a driver is assigned
- `status` is currently `assigned`

### Indexing
Indexes are created for faster lookup:
- `drivers(available)`
- `rides(driver_id)`
- `rides(status)`

## Allocation algorithm (Nearest Available Driver)
For each ride request:
1. Fetch all drivers where `available = 1`
2. Convert the pickup area and each driver area to internal (hidden) coordinates, then compute distance using:
   - `sqrt((x2 - x1)^2 + (y2 - y1)^2)`
   - where `x = latitude`, `y = longitude` (internal logic only)
3. Pick the driver with the **minimum** distance
4. Update the chosen driver to `available = 0`
5. Insert a row into `rides` to store ride history

This is a beginner-friendly, “real-world simulation” approach (brute-force nearest scan, `O(n)` per request). The UI uses the returned nearest distance to display it clearly.

## System design (Clean Architecture)
The codebase is organized so each layer has a single responsibility:
- `routes/`: maps HTTP endpoints to controller functions
- `controllers/`: validates inputs and formats responses
- `services/`: contains business logic (distance calc, nearest driver assignment, seeding)
- `db/`: encapsulates SQLite schema + query functions + indexes

## Backend APIs
Base URL: `http://localhost:4000`

### `GET /areas`
Response: `{ areas: [...] }`

### `GET /drivers`
Response: `{ drivers: [...] }`

### `POST /drivers`
Body:
```json
{ "name": "Driver X", "area": "Banjara Hills" }
```

### `POST /drivers/reset-availability`
Resets all drivers to available.

### `POST /request-ride`
Body:
```json
{ "user_area": "Banjara Hills" }
```

Response includes:
- assigned `driver`
- `ride` record
- `nearestDistanceKm` (approx)

### `GET /rides`
Response: `{ rides: [...] }`

## Frontend
Base URL: `http://localhost:5173`

The app calls the backend APIs for every button:
- Add Driver
- Request Nearest Driver
- Simulate Multiple Rides
- Reset Driver Availability

The UI never asks for or displays latitude/longitude. All inputs/outputs use Hyderabad area names.

## Setup & Run

### 1) Backend
1. Open a terminal in `backend/`
2. Create env:
   - Copy `.env.example` to `.env` (or set the same variables)
3. Start:
   - `npm run dev`

Backend runs on `http://localhost:4000`.

### 2) Frontend
1. Open another terminal in `frontend/`
2. Start:
   - `npm run dev`

Frontend runs on `http://localhost:5173`.

### Try it
- Load drivers list (seeded automatically)
- Click **Request Nearest Driver**
- Run **Simulate Rides**
- If you run out of available drivers, click **Reset Drivers Availability**

## Scalability Improvements (Bonus Ideas)
If you wanted this to behave like a production Uber/Ola backend at large scale:
- **Geo-indexing**
  - Use **Redis GEO** or a **QuadTree/R-Tree** to avoid scanning every driver
  - Use a database spatial index (e.g., PostGIS) if moving beyond SQLite
- **Real-time updates**
  - Use **WebSockets** (or SSE) to push driver availability changes and ride status instantly
- **Better allocation pipeline**
  - Move assignment into a background job / worker queue
  - Cache “nearby available drivers” results

