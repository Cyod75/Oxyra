import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme"; // Importa tu hook limpio
import { IconSettings } from "../icons/Icons"; // Importa el icono
// Importamos las imágenes
import logoBlack from "../../assets/images/logo-black.png";
import logoWhite from "../../assets/images/logo-white.png";

export default function MobileHeader() {
  // Ahora la lógica es reactiva y moderna gracias al hook
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full bg-base-100 border-b border-base-300 z-50">
      <div className="flex items-center justify-between px-4 py-3 text-base-content">
        {/* IZQUIERDA: Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <img
            src={isDark ? logoWhite : logoBlack}
            alt="Oxyra logo"
            className="w-9 h-9 object-contain"
          />
          <span className="text-lg font-semibold">Oxyra</span>
        </Link>

        {/* DERECHA: Icono Ajustes */}
        {/* IMPORTANTE: Guardamos "from" para saber a dónde volver */}
        <Link
          to="/settings"
          state={{ from: location.pathname }}
          aria-label="Ajustes"
          className="p-2 active:scale-95 transition text-base-content flex items-center justify-center"
        >
          <IconSettings />
        </Link>
      </div>
    </header>
  );
}
