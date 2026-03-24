import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login_page";
import Dashboard from "./pages/dashboard_page";
import EventPage from "./pages/event_page";
import LogsPage from "./pages/logs_page";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PRIVATE */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}