import "./App.css";
import { Routes, Route } from "react-router-dom";

// --- Layouts / Vistas ---
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

// --- Páginas ---
// CORRECCIÓN: Según tu captura de pantalla, las páginas están dentro de la carpeta "mobile"
import MobileTraining from "./pages/mobile/MobileTraining";
import MobileProducts from "./pages/mobile/MobileProducts";
import MobileStatistics from "./pages/mobile/MobileStatistics";
import MobileProfile from "./pages/mobile/MobileProfile";
import MobileSettings from "./pages/mobile/MobileSettings";

function App() {
  return (
    <>
      {/* --- VISTA MÓVIL --- */}
      {/* bg-base-100 y text-base-content aseguran que el fondo reaccione al cambio de tema */}
      <div className="md:hidden h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-200">
        <Routes>
          {/* Ruta Layout: MobileView 
              Contiene el Header y el Footer fijos.
          */}
          <Route path="/" element={<MobileView />}>
            <Route index element={<MobileTraining />} />
            <Route path="products" element={<MobileProducts />} />
            <Route path="stats" element={<MobileStatistics />} />
            <Route path="profile" element={<MobileProfile />} />
          </Route>

          {/* Ruta Independiente: Settings
              Está fuera de MobileView para no mostrar el footer/header de navegación principal
          */}
          <Route path="settings" element={<MobileSettings />} />
        </Routes>
      </div>

      {/* --- VISTA ESCRITORIO --- */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}

export default App;