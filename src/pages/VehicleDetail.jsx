import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [pings, setPings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getVehicle(vehicleId), api.getVehiclePings(vehicleId)])
      .then(([v, p]) => {
        setVehicle(v);
        setPings(
          p.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-ops-line bg-ops-panel px-6 py-4">
        <Link to="/" className="mono text-xs text-ops-dim hover:text-ops-amber">
          ← BACK TO FLEET
        </Link>
      </header>

      <main className="p-6 max-w-3xl">
        {loading && <div className="mono text-ops-dim">Loading vehicle…</div>}
        {error && <div className="mono text-ops-red">{error}</div>}

        {vehicle && (
          <>
            <div className="bg-ops-panel border border-ops-line rounded-lg p-6 mb-6">
              <div className="mono text-ops-amber text-2xl mb-1">
                {vehicle.reg_number}
              </div>
              <div className="text-sm text-ops-dim mb-4">
                Vehicle #{vehicle.vehicle_id} · Device {vehicle.device_id}
              </div>

              <div className="grid grid-cols-2 gap-4 mono text-sm">
                <div>
                  <div className="text-ops-dim text-xs mb-1">LAST LAT</div>
                  <div className="text-white">
                    {vehicle.last_ping?.lat ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-ops-dim text-xs mb-1">LAST LNG</div>
                  <div className="text-white">
                    {vehicle.last_ping?.lng ?? "—"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-ops-dim text-xs mb-1">LAST SEEN</div>
                  <div className="text-white">
                    {vehicle.last_ping?.timestamp
                      ? new Date(vehicle.last_ping.timestamp).toLocaleString()
                      : "No pings recorded"}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mono text-xs tracking-[0.2em] text-ops-dim mb-3">
              PING HISTORY — {pings.length}
            </h2>
            <div className="bg-ops-panel border border-ops-line rounded-lg divide-y divide-ops-line">
              {pings.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-3 flex items-center justify-between mono text-xs"
                >
                  <span className="text-ops-dim">
                    {new Date(p.timestamp).toLocaleString()}
                  </span>
                  <span className="text-ops-text">
                    {p.latitude}, {p.longitude}
                  </span>
                </div>
              ))}
              {pings.length === 0 && (
                <div className="px-4 py-6 text-center mono text-ops-dim text-sm">
                  No ping history for this vehicle.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
