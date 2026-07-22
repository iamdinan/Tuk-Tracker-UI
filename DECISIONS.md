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

## 3. React Context for auth, local hooks for page state

**Decision:** A single `AuthContext` holds `user` and exposes `signIn` /
`signOut`; vehicle filter/detail logic lives in page-specific hooks.

**Why:** Auth is currently the only cross-cutting state. Vehicle, station, and
ping data are fetched per page and do not need global caching yet. The custom
hooks keep page components readable without introducing a state or data-fetching
library.

**Rejected:** Redux, Zustand, and React Query are easier to justify once the app
has real caching, background refetching, optimistic updates, or live update
streams.

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

**Current scope:** The wrapper supports an optional API key header internally,
but the current exported methods are read/auth oriented and do not include
`createPing`.

## 6. Base URL is currently not normalized

**Decision in current code:** `BASE_URL` is assigned directly from
`import.meta.env.VITE_API_BASE_URL`.

**Implication:** Operators must configure `VITE_API_BASE_URL` without a
trailing slash. A trailing slash combined with path strings such as
`/auth/sign-in` can create double-slash request URLs.

**Historical note:** Earlier project notes claimed the client stripped trailing
slashes with `.replace(/\/+$/, "")`, but the current code does not do that.
Adding that normalization remains a useful hardening change.

## 7. Station and plate filtering: client-side controls

**Decision:** Use a plate-number search input and a native station select. The
station select includes `ALL STATIONS` and stations that have at least one
vehicle, each with counts.

**Why:** The expected fleet size is small enough to fetch once and filter in
the browser. A native select is compact, accessible, and scales better than a
long horizontal chip row as station count grows.

**Rejected:** Server-side filtering via query parameters is not used in the
current frontend. Revisit if the backend supports it and fleet size makes
full-list fetching expensive.

## 8. Leaflet map for ping history

**Decision:** Vehicle detail renders ping history on a Leaflet map using
`react-leaflet` and CARTO dark tiles, alongside a scrollable ping log.

**Why:** The app needs operators to inspect where a vehicle has reported from,
not just read coordinates. Leaflet is a proven mapping library, and
`react-leaflet` fits the existing React component model without needing a paid
map SDK.

**Tradeoff accepted:** The map depends on third-party tile service availability
from the operator's network. If deployment requires offline/intranet-only use,
tile hosting needs to be revisited.

## 9. Latest ping comes from ping history

**Decision:** `useVehicleDetail` sorts fetched pings by timestamp descending
and derives `latestPing` from the first item.

**Why:** This keeps the summary card, map, and ping log consistent with the
same dataset rendered on the page.

**Tradeoff accepted:** The page still fetches the vehicle object, but does not
trust or depend on `vehicle.last_ping` for the displayed latest coordinates.
If ping history is expensive or truncated later, the app may need to combine
`getLastPosition` or `vehicle.last_ping` back into the detail flow.

## 10. Mojibake cleanup still pending in UI source

**Decision in current code:** Several visible strings contain mojibake caused by
mis-encoded typographic characters.

**Implication:** The docs avoid those broken glyphs, but the UI source still
needs a small cleanup pass for loading ellipses, separators, arrows, bullets,
fallback dashes, and the search clear symbol.
