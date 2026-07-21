# Tuk Tracker UI

A React + Vite frontend for the Sri Lanka Police three-wheeler (tuk tuk) tracking API. An internal operations console to monitor, filter, and inspect registered three-wheeler vehicles and their GPS ping history.

## Tech Stack

- **Framework:** React 19
- **Build tool:** Vite 8
- **Routing:** react-router-dom 7
- **Styling:** Tailwind CSS v4
- **Auth:** JWT (stored in localStorage)

## Prerequisites

- Node.js 18+
- A running instance of the Tuk Tracker API backend

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start Vite dev server              |
| `npm run build`   | Production build to `dist/`        |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint                         |

## Routes

| Path                   | Component      | Description                   |
|------------------------|----------------|-------------------------------|
| `/login`               | Login          | Authentication page           |
| `/`                    | Dashboard      | Fleet overview with filters   |
| `/vehicles/:vehicleId` | VehicleDetail  | Vehicle GPS + ping history     |

## Environment Variables

| Variable             | Description              |
|----------------------|--------------------------|
| `VITE_API_BASE_URL`  | Backend API base URL     |

## Key Features

- JWT-based sign-in/sign-out with protected routes
- Dashboard listing all registered vehicles with station filter chips
- Vehicle detail page showing last known GPS coordinates and full ping history
- Dark ops-console UI theme
