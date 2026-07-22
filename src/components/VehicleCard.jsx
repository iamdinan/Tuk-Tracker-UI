import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle, stationName }) {
  return (
    <Link
      to={`/vehicles/${vehicle.vehicle_id}`}
      className="bg-ops-panel border border-ops-line rounded-lg p-4 hover:border-ops-amber transition group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="mono text-ops-amber text-sm">
          {vehicle.reg_number}
        </span>
        <span className="w-2 h-2 rounded-full bg-ops-green" />
      </div>
      <div className="text-sm text-ops-text mb-1">
        Vehicle #{vehicle.vehicle_id}
      </div>
      <div className="mono text-xs text-ops-dim">
        Device: {vehicle.device_id}
      </div>
      <div className="mono text-xs text-ops-dim">Station: {stationName}</div>
    </Link>
  );
}
