import { formatDate } from "../utils/formatDate";

export default function PingList({ pings, latestPing }) {
  if (pings.length === 0) {
    return (
      <div className="bg-ops-panel border border-ops-line rounded-lg p-6 text-center mono text-ops-dim text-sm">
        No pings recorded.
      </div>
    );
  }

  return (
    <div className="bg-ops-panel border border-ops-line rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ops-line mono text-xs tracking-[0.2em] text-ops-dim">
        PING LOG — {pings.length}
      </div>
      <div className="divide-y divide-ops-line max-h-[420px] overflow-y-auto">
        {pings.map((ping) => {
          const isLatest = ping.ping_id === latestPing?.ping_id;
          return (
            <div
              key={ping.ping_id}
              className={`px-4 py-3 mono text-xs ${
                isLatest ? "bg-ops-amber/10" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={
                    isLatest ? "text-ops-amber font-bold" : "text-ops-text"
                  }
                >
                  {isLatest ? "● LATEST" : formatDate(ping.timestamp)}
                </span>
                {isLatest && (
                  <span className="text-ops-dim">
                    {formatDate(ping.timestamp)}
                  </span>
                )}
              </div>
              <div className="text-ops-dim">
                {ping.lat.toFixed(5)}, {ping.lng.toFixed(5)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
