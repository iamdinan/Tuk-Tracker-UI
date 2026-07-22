export default function StationSelect({
  value,
  onChange,
  stations,
  stationCounts,
  totalCount,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "all" ? "all" : Number(e.target.value))
        }
        className="appearance-none bg-ops-panel border border-ops-line rounded pl-3 pr-9 py-2 mono text-sm text-white focus:outline-none focus:border-ops-amber cursor-pointer"
      >
        <option value="all">ALL STATIONS · {totalCount}</option>
        {stations.map((s) => (
          <option key={s.station_id} value={s.station_id}>
            {s.name.toUpperCase()} · {stationCounts.get(s.station_id)}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ops-dim"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
