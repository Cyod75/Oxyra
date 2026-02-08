import { Routes, Route, Navigate } from "react-router-dom";

// --- Layouts ---
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

// --- Components Shared ---
import ProtectedRoute from "./components/shared/ProtectedRoute";

// --- Auth Pages (NUEVAS) ---
import Welcome from "./pages/auth/Welcome";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import RoutineDetail from "./pages/mobile/workout/RoutineDetail";
import WorkoutSessionPage from "./pages/mobile/workout/WorkoutSessionPage";

// --- Mobile Pages ---
import MobileTraining from "./pages/mobile/MobileTraining";
import MobileProducts from "./pages/mobile/MobileProducts";
import MobileStatistics from "./pages/mobile/MobileStatistics";
import MobileProfile from "./pages/mobile/MobileProfile";
import MobileSettings from "./pages/mobile/MobileSettings";
import MobileSearch from "./pages/mobile/MobileSearch";
import MobilePublicProfile from "./pages/mobile/MobilePublicProfile";
import PublicProfile from "./pages/mobile/social/PublicProfile";

function App() {
  return (
    <>
      <div className="md:hidden h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-200">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          {/* Si ya está logueado, no debería ver el Welcome.*/}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- RUTAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MobileView />}>
              <Route index element={<MobileTraining />} />
              <Route path="products" element={<MobileProducts />} />
              <Route path="stats" element={<MobileStatistics />} />
              <Route path="profile" element={<MobileProfile />} />
              <Route path="search" element={<MobileSearch />} />
              <Route path="profile/:username" element={<MobilePublicProfile />} /> 
              <Route path="/profile/:username" element={<PublicProfile />} />
            </Route>

            <Route path="settings" element={<MobileSettings />} />
            <Route path="routine/:id" element={<RoutineDetail />} />
            <Route
              path="/workout/session/:routineId"
              element={<WorkoutSessionPage />}
            />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}

export default App;
