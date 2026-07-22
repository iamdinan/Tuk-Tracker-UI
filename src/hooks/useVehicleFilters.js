import { useMemo, useState } from "react";

export function useVehicleFilters(vehicles, stations) {
  const [stationFilter, setStationFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    if (stationFilter !== "all") {
      result = result.filter((v) => v.station_id === stationFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((v) =>
        v.reg_number?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [vehicles, stationFilter, search]);

  const isFiltered = stationFilter !== "all" || search.length > 0;

  return {
    stationFilter,
    setStationFilter,
    search,
    setSearch,
    activeStations,
    stationCounts,
    filteredVehicles,
    isFiltered,
  };
}
