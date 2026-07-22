import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useVehicleFilters } from "../hooks/useVehicleFilters";
import VehicleSearchInput from "../components/VehicleSearchInput";
import StationSelect from "../components/StationSelect";
import VehicleGrid from "../components/VehicleGrid";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const {
    stationFilter,
    setStationFilter,
    search,
    setSearch,
    activeStations,
    stationCounts,
    filteredVehicles,
    isFiltered,
  } = useVehicleFilters(vehicles, stations);

  function getStationName(stationId) {
    return stations.find((s) => s.station_id === stationId)?.name || "—";
  }

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
            {isFiltered && ` / ${vehicles.length}`}
          </h2>
        </div>

        {loading && (
          <div className="mono text-ops-dim">Loading fleet data…</div>
        )}
        {error && <div className="mono text-ops-red">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <VehicleSearchInput value={search} onChange={setSearch} />
              <StationSelect
                value={stationFilter}
                onChange={setStationFilter}
                stations={activeStations}
                stationCounts={stationCounts}
                totalCount={vehicles.length}
              />
            </div>

            <VehicleGrid
              vehicles={filteredVehicles}
              getStationName={getStationName}
            />
          </>
        )}
      </main>
    </div>
  );
}
