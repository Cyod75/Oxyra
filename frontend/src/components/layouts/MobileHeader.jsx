import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { IconSettings, IconSearch } from "../icons/Icons"; // Asegúrate de importar IconSearch

import logoBlack from "../../assets/images/oxyra-black.png";
import logoWhite from "../../assets/images/oxyra-white.png";

export default function MobileHeader() {
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 h-14">
      <div className="flex items-center justify-between px-4 h-full text-foreground">
        {/* IZQUIERDA: Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 select-none hover:opacity-80 transition-opacity"
        >
          <img
            src={isDark ? logoWhite : logoBlack}
            alt="Oxyra logo"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-lg font-bold tracking-tight">Oxyra</span>
        </Link>

        {/* DERECHA: Acciones (Buscar + Ajustes) */}
        <div className="flex items-center gap-1">
          {/* 1. BOTÓN BUSCAR (NUEVO) */}
          <Link
            to="/search"
            className="p-2 rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
          >
            <IconSearch className="w-5 h-5" />
          </Link>

          {/* 2. BOTÓN AJUSTES */}
          <Link
            to="/settings"
            state={{ from: location.pathname }}
            className="p-2 rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground"
          >
            <IconSettings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
