import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleDetail from "./pages/VehicleDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/:vehicleId"
              element={
                <ProtectedRoute>
                  <VehicleDetail />
                </ProtectedRoute>
              }
            />
          </Routes>

          <footer className="fixed bottom-3 left-3 z-50 rounded-full border border-ops-line/60 bg-ops-panel/60 px-3 py-1.5 shadow-md shadow-black/10 backdrop-blur-sm">
            <p className="mono text-[10px] tracking-[0.08em] text-ops-dim/70">
              Enchanted by{" "}
              <span className="text-ops-amber/80">Dinan🪄</span>
            </p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
