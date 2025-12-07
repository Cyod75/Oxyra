import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <--- 1. Importamos Link
// Importamos las imágenes para que Vite las procese en el build
import logoBlack from "../../assets/images/logo-black.png";
import logoWhite from "../../assets/images/logo-white.png";

export default function MobileHeader() {
  // Usamos la variable importada en lugar del string
  const [logoSrc, setLogoSrc] = useState(logoBlack);

  useEffect(() => {
    const updateLogo = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      // Asumimos que 'nord' es claro y cualquier otro (sunset) es oscuro
      if (theme === "nord") {
        setLogoSrc(logoBlack);
      } else {
        setLogoSrc(logoWhite);
      }
    };

    updateLogo(); // Ejecutar al cargar

    // Observar cambios dinámicos de tema
    const observer = new MutationObserver(updateLogo);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-base-100 border-b border-current z-50">
      <div className="flex items-center justify-between px-4 py-3 text-base-content">
        {/* IZQUIERDA: logo (PNG) + nombre */}
        {/* Envolvemos el logo en un Link a "/" para que sirva de botón Home también */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <img
            src={logoSrc}
            alt="Oxyra logo"
            className="w-9 h-9 object-contain"
          />
          <span className="text-lg font-semibold">Oxyra</span>
        </Link>

        {/* DERECHA: Botón ajustes -> Ahora es un Link */}
        <Link
          to="/settings"
          aria-label="Ajustes"
          className="p-2 active:scale-95 transition text-base-content flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
