# Project Memory / Architecture

## Overview

Tuk Tuk Tracking Console - React + Vite frontend for the Sri Lanka Police
three-wheeler tracking API. It consumes an existing deployed Express/MongoDB
REST backend.

## Tech Stack

- **Build tool:** Vite
- **Framework:** React functional components and hooks
- **Routing:** `react-router-dom`
- **Styling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin
- **State:** React Context (`AuthContext`) plus local component state
- **HTTP:** native `fetch`, wrapped in one API client module
- **Env:** Vite env vars (`VITE_API_BASE_URL`)

## Project Structure

```text
.
|-- .env                         # VITE_API_BASE_URL, if present, is gitignored
|-- vite.config.js               # Vite + React + Tailwind plugin config
|-- MEMORY.md
|-- DECISIONS.md
|-- src/
|   |-- main.jsx                 # React root, imports index.css
|   |-- App.jsx                  # BrowserRouter + route definitions
|   |-- index.css                # Tailwind import + ops-console theme tokens
|   |-- api/
|   |   `-- client.js            # Fetch wrapper and all API calls
|   |-- context/
|   |   `-- AuthContext.jsx      # Auth state, sign-in, sign-out
|   |-- components/
|   |   `-- ProtectedRoute.jsx   # Redirects to /login if unauthenticated
|   `-- pages/
|       |-- Login.jsx            # POST /auth/sign-in form
|       |-- Dashboard.jsx        # Vehicle list + station filter
|       `-- VehicleDetail.jsx    # Single vehicle + ping history
`-- public/
    |-- favicon.svg
    `-- icons.svg
```

## Design System

"Ops console" aesthetic: dark navy background (`#0b1220`), amber accent
(`#f2a93b`) for active/highlighted state, green dot for live vehicle status,
and monospace styling for IDs, coordinates, timestamps, and device keys.
Tailwind theme tokens are defined in `src/index.css` under `@theme`:
`--color-ops-bg`, `--color-ops-panel`, `--color-ops-line`,
`--color-ops-amber`, `--color-ops-green`, `--color-ops-red`,
`--color-ops-text`, `--color-ops-dim`, `--font-mono`, and `--font-sans`.

The current source contains some mojibake in visible strings where typographic
characters were encoded incorrectly, for example the loading ellipsis, em dash,
middle dot, back arrow, and fallback dash. The docs are now normalized to ASCII,
but the UI source has not been changed.

## API Client (`src/api/client.js`)

- `BASE_URL` is read directly from `import.meta.env.VITE_API_BASE_URL`.
- The current client does **not** strip trailing slashes from the base URL. If
  `.env` contains a trailing slash, request paths such as `/auth/sign-in` can
  produce double-slash URLs.
- `request()` wraps `fetch` and builds JSON requests with
  `Content-Type: application/json`.
- Attaches `Authorization: Bearer <token>` automatically when
  `tuktuk_token` exists in `localStorage`.
- Attaches `X-API-Key` when explicitly passed, currently only through
  `createPing`.
- On any `401` response: clears `tuktuk_token` and `tuktuk_user` from
  `localStorage`, hard redirects to `/login`, and throws `Session expired`.
- Non-OK responses attempt to read a JSON `message` or `error` field before
  throwing a generic status-based error.
- `204` responses return `null`; all other successful responses are parsed as
  JSON.
- Exposes one method per backend route: `signIn`, `getProvinces`,
  `getProvince`, `getDistricts`, `getDistrict`, `getStations`, `getStation`,
  `getVehicles`, `getVehicle`, `getVehiclePings`, `getVehiclePing`,
  `getLastPosition`, and `createPing`.

## Auth (`src/context/AuthContext.jsx`)

- `AuthProvider` initializes `user` from `localStorage` key `tuktuk_user`.
- `signIn(username, password)` calls `api.signIn`, stores `token` and `user`
  under `tuktuk_token` / `tuktuk_user`, and updates context state.
- `signOut()` clears both keys and resets context state.
- `useAuth()` exposes the context value, currently `{ user, signIn, signOut }`.
- `ProtectedRoute` checks context `user` or a token already in `localStorage`
  to cover page refreshes before redirecting unauthenticated users to `/login`.

## Pages

### `Login.jsx`

- Username/password form calls `signIn()` and redirects to `/` on success.
- Shows an inline error from `Error.message` on failure.
- Shows a loading button state while the sign-in request is pending.

### `Dashboard.jsx`

- Fetches `getVehicles()` and `getStations()` in parallel on mount.
- Renders a grid of vehicle cards showing registration number, vehicle ID,
  device ID, station name, and a green status dot.
- Each card links to `/vehicles/:vehicleId`.
- Station filter is a horizontal chip bar above the grid.
- Station chips are built only from stations with at least one vehicle, using a
  `Map` of `station_id` to count.
- "ALL STATIONS" shows the total vehicle count; each station chip shows its own
  count.
- Filtering is client-side against the already-fetched `vehicles` array.
- Header count shows `filtered / total` when a station filter is active.
- The header shows the signed-in username, falling back to `operator`, plus a
  sign-out button.

### `VehicleDetail.jsx`

- Fetches `getVehicle(vehicleId)` and `getVehiclePings(vehicleId)` in parallel.
- Sorts pings reverse-chronologically by `timestamp` before rendering.
- Shows last known latitude, longitude, and timestamp from `vehicle.last_ping`.
- Shows ping history rows with timestamp plus latitude/longitude.
- Provides a link back to the dashboard.

## Known Gaps / Follow-ups

- No live map view for `last-position`.
- No province or district filtering; only station filtering exists.
- `createPing` exists in the API client but is not called from any page.
- Station filtering is client-side only. If fleet size grows, consider a
  server-side `GET /vehicles?station_id=` backend contract.
- The visible UI strings should be cleaned up to replace mojibake with proper
  characters or ASCII equivalents.
- `VITE_API_BASE_URL` should be configured without a trailing slash unless the
  client is updated to normalize it.

## Backend CORS Requirement

The frontend runs on `http://localhost:5173` in dev. The deployed backend must
respond to CORS preflight (`OPTIONS`) requests with appropriate
`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and
`Access-Control-Allow-Headers`. CORS middleware must be registered before JWT
auth, because preflight requests carry no `Authorization` header.

## Running

```bash
npm install
npm run dev
```
