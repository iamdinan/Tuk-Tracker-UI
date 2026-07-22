import { useParams, Link } from "react-router-dom";
import { useVehicleDetail } from "../hooks/useVehicleDetail";
import VehicleSummaryCard from "../components/VehicleSummaryCard";
import PingMap from "../components/PingMap";

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const { vehicle, pings, latestPing, loading, error } =
    useVehicleDetail(vehicleId);

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
            <VehicleSummaryCard vehicle={vehicle} latestPing={latestPing} />

            <h2 className="mono text-xs tracking-[0.2em] text-ops-dim mb-3">
              PING MAP — {pings.length} RECORDED
            </h2>
            <PingMap pings={pings} latestPing={latestPing} />
          </>
        )}
      </main>
    </div>
  );
}
