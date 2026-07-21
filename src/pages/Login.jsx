import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mono text-ops-amber text-xs tracking-[0.3em] mb-2">
            SRI LANKA POLICE
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Tuk Tuk Tracking Console
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ops-panel border border-ops-line rounded-lg p-6 space-y-4 scanline"
        >
          <div>
            <label className="block mono text-xs text-ops-dim mb-1">
              USERNAME
            </label>
            <input
              className="w-full bg-ops-bg border border-ops-line rounded px-3 py-2 mono text-sm text-white focus:outline-none focus:border-ops-amber"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block mono text-xs text-ops-dim mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              className="w-full bg-ops-bg border border-ops-line rounded px-3 py-2 mono text-sm text-white focus:outline-none focus:border-ops-amber"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-ops-red text-sm mono">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ops-amber text-ops-bg font-semibold rounded py-2 hover:brightness-110 disabled:opacity-50 transition"
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
