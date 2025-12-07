import "./App.css";
import { Routes, Route } from "react-router-dom";

// Layouts y Vistas
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

// Páginas Móviles
import MobileTraining from "./components/mobile/pages/MobileTraining";
import MobileProducts from "./components/mobile/pages/MobileProducts";
import MobileStatistics from "./components/mobile/pages/MobileStatistics";
import MobileProfile from "./components/mobile/pages/MobileProfile";
import MobileSettings from "./components/mobile/pages/MobileSettings";

function App() {
  return (
    <>
      {/* VISTA MÓVIL: Contiene el sistema de rutas */}
      <div className="md:hidden h-screen flex flex-col">
        <Routes>
          {/* MobileView es el Layout (Header + Footer) */}
          <Route path="/" element={<MobileView />}>
            {/* Index: Lo que se ve al entrar a "/" */}
            <Route index element={<MobileTraining />} />
            
            {/* Rutas internas */}
            <Route path="products" element={<MobileProducts />} />
            <Route path="stats" element={<MobileStatistics />} />
            <Route path="profile" element={<MobileProfile />} />
          </Route>
          <Route path="settings" element={<MobileSettings />} />
        </Routes>
      </div>

      {/* VISTA ESCRITORIO: Se mantiene igual por ahora */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}

export default App;