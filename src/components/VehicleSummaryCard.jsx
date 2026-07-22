import { formatDate } from "../utils/formatDate";

export default function VehicleSummaryCard({ vehicle, latestPing }) {
  return (
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
          <div className="text-white">{latestPing?.lat ?? "—"}</div>
        </div>
        <div>
          <div className="text-ops-dim text-xs mb-1">LAST LNG</div>
          <div className="text-white">{latestPing?.lng ?? "—"}</div>
        </div>
        <div className="col-span-2">
          <div className="text-ops-dim text-xs mb-1">LAST SEEN</div>
          <div className="text-white">
            {latestPing
              ? formatDate(latestPing.timestamp)
              : "No pings recorded"}
          </div>
        </div>
      </div>
    </div>
  );
}
