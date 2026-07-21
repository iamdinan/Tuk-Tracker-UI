import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stationFilter, setStationFilter] = useState("all");
  const { user, signOut } = useAuth();

  useEffect(() => {
    Promise.all([api.getVehicles(), api.getStations()])
      .then(([v, s]) => {
        setVehicles(v);
        setStations(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function stationName(stationId) {
    return stations.find((s) => s.station_id === stationId)?.name || "—";
  }

  const filteredVehicles = useMemo(() => {
    if (stationFilter === "all") return vehicles;
    return vehicles.filter((v) => v.station_id === stationFilter);
  }, [vehicles, stationFilter]);

  // Only show stations that actually have vehicles, counts included
  const stationCounts = useMemo(() => {
    const counts = new Map();
    for (const v of vehicles) {
      counts.set(v.station_id, (counts.get(v.station_id) || 0) + 1);
    }
    return counts;
  }, [vehicles]);

  const activeStations = useMemo(
    () => stations.filter((s) => stationCounts.has(s.station_id)),
    [stations, stationCounts],
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-ops-line bg-ops-panel px-6 py-4 flex items-center justify-between">
        <div>
          <div className="mono text-ops-amber text-xs tracking-[0.3em]">
            SRI LANKA POLICE
          </div>
          <h1 className="text-lg font-semibold text-white">
            Tuk Tuk Tracking Console
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="mono text-sm text-ops-dim">
            {user?.username || "operator"}
          </span>
          <button
            onClick={signOut}
            className="mono text-xs border border-ops-line rounded px-3 py-1.5 text-ops-text hover:border-ops-red hover:text-ops-red transition"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mono text-xs tracking-[0.2em] text-ops-dim">
            REGISTERED VEHICLES — {filteredVehicles.length}
            {stationFilter !== "all" && ` / ${vehicles.length}`}
          </h2>
        </div>

        {loading && (
          <div className="mono text-ops-dim">Loading fleet data…</div>
        )}
        {error && <div className="mono text-ops-red">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setStationFilter("all")}
                className={`mono text-xs rounded-full px-3 py-1.5 border transition ${
                  stationFilter === "all"
                    ? "border-ops-amber text-ops-amber bg-ops-amber/10"
                    : "border-ops-line text-ops-dim hover:border-ops-text hover:text-ops-text"
                }`}
              >
                ALL STATIONS · {vehicles.length}
              </button>
              {activeStations.map((s) => (
                <button
                  key={s.station_id}
                  onClick={() => setStationFilter(s.station_id)}
                  className={`mono text-xs rounded-full px-3 py-1.5 border transition ${
                    stationFilter === s.station_id
                      ? "border-ops-amber text-ops-amber bg-ops-amber/10"
                      : "border-ops-line text-ops-dim hover:border-ops-text hover:text-ops-text"
                  }`}
                >
                  {s.name.toUpperCase()} · {stationCounts.get(s.station_id)}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((v) => (
                <Link
                  key={v.vehicle_id}
                  to={`/vehicles/${v.vehicle_id}`}
                  className="bg-ops-panel border border-ops-line rounded-lg p-4 hover:border-ops-amber transition group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="mono text-ops-amber text-sm">
                      {v.reg_number}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-ops-green" />
                  </div>
                  <div className="text-sm text-ops-text mb-1">
                    Vehicle #{v.vehicle_id}
                  </div>
                  <div className="mono text-xs text-ops-dim">
                    Device: {v.device_id}
                  </div>
                  <div className="mono text-xs text-ops-dim">
                    Station: {stationName(v.station_id)}
                  </div>
                </Link>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="mono text-ops-dim text-sm">
                No vehicles for this station.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
