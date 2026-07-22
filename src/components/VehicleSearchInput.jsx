export default function VehicleSearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ops-dim"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by plate number…"
        className="w-full bg-ops-panel border border-ops-line rounded pl-9 pr-3 py-2 mono text-sm text-white placeholder:text-ops-dim focus:outline-none focus:border-ops-amber"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ops-dim hover:text-ops-red mono text-xs"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
