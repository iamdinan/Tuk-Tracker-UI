import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { formatDate } from "../utils/formatDate";

export default function PingMap({ pings, latestPing }) {
  if (pings.length === 0) {
    return (
      <div className="bg-ops-panel border border-ops-line rounded-lg p-6 text-center mono text-ops-dim text-sm">
        No ping history to display on map.
      </div>
    );
  }

  const center = [latestPing.lat, latestPing.lng];

  return (
    <div className="rounded-lg overflow-hidden border border-ops-line">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "420px", width: "100%", background: "#0b1220" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        {pings.map((ping) => {
          const isLatest = ping.ping_id === latestPing.ping_id;
          return (
            <CircleMarker
              key={ping.ping_id}
              center={[ping.lat, ping.lng]}
              radius={isLatest ? 9 : 5}
              pathOptions={{
                color: isLatest ? "#f2a93b" : "#64748b",
                fillColor: isLatest ? "#f2a93b" : "#64748b",
                fillOpacity: isLatest ? 0.9 : 0.5,
                weight: isLatest ? 2 : 1,
              }}
            >
              <Popup>
                <div className="mono text-xs">
                  <div className={isLatest ? "font-bold" : ""}>
                    {isLatest ? "● LATEST PING" : "Ping"}
                  </div>
                  <div>{formatDate(ping.timestamp)}</div>
                  <div>
                    {ping.lat.toFixed(5)}, {ping.lng.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
