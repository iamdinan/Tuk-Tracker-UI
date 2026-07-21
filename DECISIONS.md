# Technical Decisions

## 1. Vite over Create React App / Next.js

**Decision:** React + Vite, client-side only.

**Why:** The backend is already deployed and stateless from the frontend's
perspective. No server-side rendering, file-based routing, or frontend Node
server is required. Vite gives fast dev iteration and a static build that can
be hosted anywhere.

**Rejected:** Next.js would add SSR/server complexity with little benefit,
because this is an authenticated internal tool rather than an SEO-facing site.

## 2. Tailwind CSS v4 for styling

**Decision:** Tailwind via `@tailwindcss/vite`, with a custom `@theme` token
set for the ops-console palette.

**Why:** It supports fast iteration while keeping styling close to markup, and
the theme tokens let the app reference semantic colors such as
`--color-ops-amber` instead of hardcoding every value.

**Rejected:** Plain CSS modules add boilerplate for this small app. A component
library such as MUI or Chakra would add weight and work against the custom
ops-console visual identity.

## 3. React Context for auth, no external state library

**Decision:** A single `AuthContext` holds `user` and exposes `signIn` /
`signOut`; the token itself lives in `localStorage`.

**Why:** Auth is currently the only cross-cutting state. Vehicle and station
data is fetched per page and does not need global caching yet.

**Rejected:** Redux, Zustand, and React Query are easier to justify once the app
has real caching, background refetching, optimistic updates, or live map data.

## 4. Token storage: localStorage

**Decision:** JWT is stored in `localStorage` under `tuktuk_token`; user data is
stored under `tuktuk_user`.

**Why:** The backend issues a bearer token via `POST /auth/sign-in` and expects
`Authorization: Bearer <token>` on protected requests. It does not set cookies,
so `localStorage` is the simplest way to persist login state across refreshes
without backend changes.

**Rejected:** httpOnly cookies would require backend changes for `Set-Cookie`
and CSRF handling. Memory-only storage would force operators to sign in again
on every page refresh.

**Tradeoff accepted:** `localStorage` is readable by JavaScript, so XSS could
steal the token. Revisit httpOnly cookies plus CSRF if the app is exposed more
broadly.

## 5. Centralized `request()` wrapper

**Decision:** Use one `src/api/client.js` module with an internal `request()`
function and one exported method per endpoint.

**Why:** This centralizes auth header injection, 401 handling, JSON error
message extraction, and API surface naming so pages do not duplicate request
logic.

## 6. Base URL is currently not normalized

**Decision in current code:** `BASE_URL` is assigned directly from
`import.meta.env.VITE_API_BASE_URL`.

**Implication:** Operators must configure `VITE_API_BASE_URL` without a
trailing slash. A trailing slash combined with path strings such as
`/auth/sign-in` can create double-slash request URLs.

**Historical note:** Earlier project notes claimed the client stripped trailing
slashes with `.replace(/\/+$/, "")`, but the current code does not do that.
Adding that normalization remains a useful hardening change.

## 7. Station filter: client-side chips

**Decision:** Horizontal toggle chips, one per station that has at least one
vehicle, plus an "ALL STATIONS" chip. Each chip shows a count.

**Why:** The expected fleet size is small enough to show stations directly.
Chips keep options and counts visible for scanning.

**Rejected:** Server-side filtering via `station_id` query param is not used in
the current frontend. Revisit if the backend supports it and fleet size makes
full-list fetching expensive.

## 8. No map library yet

**Decision:** Vehicle detail shows last latitude/longitude and timestamp as
text, not a rendered map.

**Why:** The current app is scoped to auth, list, detail, and station filtering
before adding a mapping dependency.

**Rejected for now:** Leaflet or Mapbox integration. It is straightforward to
add later once the data flow is stable against the deployed API.

## 9. Mojibake cleanup still pending in UI source

**Decision in current code:** Several visible strings contain mojibake caused by
mis-encoded typographic characters.

**Implication:** The docs avoid those broken glyphs, but the UI source still
needs a small cleanup pass for loading ellipses, separators, arrows, and
fallback dashes.
