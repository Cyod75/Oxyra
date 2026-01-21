import React from "react";
import { Link, useLocation } from "react-router-dom";
// CORRECCIÓN: Importar desde el Contexto, no desde 'hooks'
import { useTheme } from "../../context/ThemeContext"; 
import { IconSettings } from "../icons/Icons"; 

// Imágenes (Asegúrate de que estas rutas existan, si no, usa texto temporalmente)
import logoBlack from "../../assets/images/logo-black.png";
import logoWhite from "../../assets/images/logo-white.png";

export default function MobileHeader() {
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    // CAMBIO: Estilo 'Glassmorphism' moderno con borde sutil
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 h-14">
      <div className="flex items-center justify-between px-4 h-full text-foreground">
        
        {/* IZQUIERDA: Logo */}
        <Link to="/" className="flex items-center gap-3 select-none hover:opacity-80 transition-opacity">
          {/* Si las imágenes fallan, el texto "Oxyra" se verá bien */}
          <img
            src={isDark ? logoWhite : logoBlack}
            alt="Oxyra logo"
            className="w-8 h-8 object-contain"
            onError={(e) => {e.target.style.display = 'none'}} // Ocultar si falla img
          />
          <span className="text-lg font-bold tracking-tight">Oxyra</span>
        </Link>

        {/* DERECHA: Icono Ajustes */}
        <Link
          to="/settings"
          state={{ from: location.pathname }}
          aria-label="Ajustes"
          // CAMBIO: Hover state con utilidades standard
          className="p-2 rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
        >
          <IconSettings className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}