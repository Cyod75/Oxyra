import "./App.css";
// IMPORTACIONES CORREGIDAS
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

function App() {
  return (
    <>
      {/* VISTA MÓVIL: Visible por defecto (block), oculto en escritorio (md:hidden) */}
      <div className="block md:hidden">
        <MobileView />
      </div>

      {/* VISTA ESCRITORIO: Oculto por defecto (hidden), visible en escritorio (md:block) */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}

export default App;
