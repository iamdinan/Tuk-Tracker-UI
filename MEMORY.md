# Project Memory / Architecture

## Overview

Tuk Tracker UI - React + Vite frontend for the Sri Lanka Police three-wheeler
tracking API. It is an authenticated internal operations console for listing,
filtering, and inspecting registered tuk tuk vehicles and their GPS ping
history.

## Tech Stack

- **Build tool:** Vite 8
- **Framework:** React 19 functional components and hooks
- **Routing:** `react-router-dom` 7
- **Styling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin
- **Maps:** Leaflet 1.9 + `react-leaflet` 5
- **State:** React Context (`AuthContext`), local component state, custom hooks
- **HTTP:** native `fetch`, wrapped in one API client module
- **Env:** Vite env vars (`VITE_API_BASE_URL`)

## Project Structure

```text
.
|-- .env                         # VITE_API_BASE_URL, if present, is gitignored
|-- .env.sample
|-- vercel.json                  # SPA rewrites for Vercel deployment
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
|   |-- hooks/
|   |   |-- useVehicleDetail.js  # Vehicle + ping fetching/sorting
|   |   `-- useVehicleFilters.js # Station/search filtering
|   |-- components/
|   |   |-- ProtectedRoute.jsx
|   |   |-- StationSelect.jsx
|   |   |-- VehicleSearchInput.jsx
|   |   |-- VehicleGrid.jsx
|   |   |-- VehicleCard.jsx
|   |   |-- VehicleSummaryCard.jsx
|   |   |-- PingMap.jsx
|   |   |-- PingList.jsx
|   |   `-- DemoCredentialsBanner.jsx
|   `-- pages/
|       |-- Login.jsx
|       |-- Dashboard.jsx
|       `-- VehicleDetail.jsx
`-- public/
    |-- favicon.png
    `-- icons.svg
```

## Design System

The UI uses a dark operations-console aesthetic: navy background (`#0b1220`),
amber accent (`#f2a93b`) for active/highlighted state, green dot for vehicle
status, and monospace styling for IDs, coordinates, timestamps, and device
keys. The page background has a subtle grid pattern. Tailwind theme tokens are
defined in `src/index.css` under `@theme`: `--color-ops-bg`,
`--color-ops-panel`, `--color-ops-line`, `--color-ops-amber`,
`--color-ops-green`, `--color-ops-red`, `--color-ops-text`,
`--color-ops-dim`, `--font-mono`, and `--font-sans`.

The current source contains mojibake in visible strings where typographic
characters were encoded incorrectly, including ellipses, dashes, bullets, the
back arrow, separators, and the clear-search symbol. The docs are normalized to
ASCII, but the UI source has not been cleaned up yet.

## API Client (`src/api/client.js`)

- `BASE_URL` is read directly from `import.meta.env.VITE_API_BASE_URL`.
- The client does not strip trailing slashes from the base URL. If `.env`
  contains a trailing slash, request paths such as `/auth/sign-in` can produce
  double-slash URLs.
- `request()` wraps `fetch` and builds JSON requests with
  `Content-Type: application/json`.
- Attaches `Authorization: Bearer <token>` automatically when `tuktuk_token`
  exists in `localStorage`.
- Supports an optional `X-API-Key` header internally, but no exported API method
  currently passes an API key.
- On any `401` response: clears `tuktuk_token` and `tuktuk_user` from
  `localStorage`, hard redirects to `/login`, and throws `Session expired`.
- Non-OK responses attempt to read a JSON `message` or `error` field before
  throwing a generic status-based error.
- `204` responses return `null`; all other successful responses are parsed as
  JSON.
- Exposes methods for backend read/auth routes: `signIn`, `getProvinces`,
  `getProvince`, `getDistricts`, `getDistrict`, `getStations`, `getStation`,
  `getVehicles`, `getVehicle`, `getVehiclePings`, `getVehiclePing`, and
  `getLastPosition`.

## Auth (`src/context/AuthContext.jsx`)

- `AuthProvider` initializes `user` from `localStorage` key `tuktuk_user`.
- `signIn(username, password)` calls `api.signIn`, stores `token` and `user`
  under `tuktuk_token` / `tuktuk_user`, and updates context state.
- `signOut()` clears both keys and resets context state.
- `useAuth()` exposes the context value, currently `{ user, signIn, signOut }`.
- `ProtectedRoute` checks context `user` or a token already in `localStorage`
  to cover page refreshes before redirecting unauthenticated users to `/login`.

## Pages and Data Flow

### `Login.jsx`

- Username/password form calls `signIn()` and redirects to `/` on success.
- Shows an inline error from `Error.message` on failure.
- Shows a loading button state while the sign-in request is pending.
- Renders `DemoCredentialsBanner` as a fixed bottom-right widget.

### `DemoCredentialsBanner` (`src/components/DemoCredentialsBanner.jsx`)

- Collapsible floating panel on the login page showing demo account credentials.
- Default state is expanded; can be minimized to a small amber "i" button.
- Displays hardcoded demo accounts: `dispatcher` / `dispatch123`.
- Uses the same ops-console theme tokens for styling.

### `Dashboard.jsx`

- Fetches `getVehicles()` and `getStations()` in parallel on mount.
- Uses `useVehicleFilters()` for station filter state, plate-number search
  state, station counts, active stations, filtered vehicle output, and
  `isFiltered`.
- Renders a responsive vehicle grid through `VehicleGrid` and `VehicleCard`.
- Cards show registration number, vehicle ID, device ID, station name, and a
  green status dot, and link to `/vehicles/:vehicleId`.
- Station filtering is a native select (`StationSelect`), not chips. It shows
  `ALL STATIONS` plus only stations that have at least one vehicle, with counts.
- Search is client-side and matches `reg_number` only.
- Filtering is fully client-side against the already-fetched `vehicles` array.
- Header count shows `filtered / total` whenever either station or search
  filtering is active.
- Header shows the signed-in username, falling back to `operator`, plus a
  sign-out button.

### `VehicleDetail.jsx`

- Uses `useVehicleDetail(vehicleId)`.
- Fetches `getVehicle(vehicleId)` and `getVehiclePings(vehicleId)` in parallel.
- Sorts pings reverse-chronologically by `timestamp`.
- Derives `latestPing` as the first sorted ping, not from `vehicle.last_ping`.
- Shows a vehicle summary card with registration number, vehicle/device IDs,
  latest latitude/longitude, and latest timestamp.
- Shows a Leaflet map (`PingMap`) and a scrollable ping log (`PingList`) side by
  side on large screens.
- Provides a link back to the dashboard.

## Map View

- `PingMap` uses `react-leaflet` with `MapContainer`, `TileLayer`,
  `CircleMarker`, and `Popup`.
- Tile source is CARTO dark basemap:
  `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`.
- The map centers on `latestPing`, starts at zoom 14, and constrains panning to
  one world copy using world bounds, `maxBoundsViscosity`, and `noWrap`.
- All pings render as circle markers; latest ping is larger and amber, older
  pings are smaller and muted.
- Empty ping history renders a panel message instead of a map.

## Vercel Deployment (`vercel.json`)

- SPA rewrites: all routes (`/(.*)`) are served from `/index.html` so client-side
  routing works on Vercel without 404s on hard refresh.

## Known Gaps / Follow-ups

- No province or district filtering; only station and plate-number filtering
  exist.
- `getLastPosition` exists in the API client but is not currently called from
  any page.
- No `createPing` export in the current frontend API client.
- Station and search filtering are client-side only. If fleet size grows,
  consider a server-side `GET /vehicles?station_id=&q=` backend contract.
- Visible UI strings should be cleaned up to replace mojibake with proper
  characters or ASCII equivalents.
- `VITE_API_BASE_URL` should be configured without a trailing slash unless the
  client is updated to normalize it.
- Leaflet tiles require network access to CARTO/OpenStreetMap tile services in
  the operator's environment.

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
