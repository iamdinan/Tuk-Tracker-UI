import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useVehicleDetail(vehicleId) {
  const [vehicle, setVehicle] = useState(null);
  const [pings, setPings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([api.getVehicle(vehicleId), api.getVehiclePings(vehicleId)])
      .then(([v, p]) => {
        const sorted = [...p].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
        setVehicle(v);
        setPings(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  const latestPing = pings[0] || null;

  return { vehicle, pings, latestPing, loading, error };
}
