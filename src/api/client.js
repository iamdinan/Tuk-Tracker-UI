const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  return localStorage.getItem("tuktuk_token");
}

async function request(
  path,
  { method = "GET", body, apiKey, headers = {} } = {},
) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  const token = getToken();
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  if (apiKey) finalHeaders["X-API-Key"] = apiKey;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("tuktuk_token");
    localStorage.removeItem("tuktuk_user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  signIn: (username, password) =>
    request("/auth/sign-in", { method: "POST", body: { username, password } }),

  getProvinces: () => request("/provinces"),
  getProvince: (id) => request(`/provinces/${id}`),

  getDistricts: () => request("/districts"),
  getDistrict: (id) => request(`/districts/${id}`),

  getStations: () => request("/stations"),
  getStation: (id) => request(`/stations/${id}`),

  getVehicles: () => request("/vehicles"),
  getVehicle: (id) => request(`/vehicles/${id}`),
  getVehiclePings: (id) => request(`/vehicles/${id}/pings`),
  getVehiclePing: (id, pingId) => request(`/vehicles/${id}/pings/${pingId}`),
  getLastPosition: (id) => request(`/vehicles/${id}/last-position`),

  createPing: (id, { latitude, longitude }, apiKey) =>
    request(`/vehicles/${id}/pings`, {
      method: "POST",
      body: { latitude, longitude },
      apiKey,
    }),
};
