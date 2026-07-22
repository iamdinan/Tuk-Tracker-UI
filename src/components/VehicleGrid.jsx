import VehicleCard from "./VehicleCard";

export default function VehicleGrid({ vehicles, getStationName }) {
  if (vehicles.length === 0) {
    return (
      <div className="mono text-ops-dim text-sm">
        No vehicles match your search/filter.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.vehicle_id}
          vehicle={v}
          stationName={getStationName(v.station_id)}
        />
      ))}
    </div>
  );
}
