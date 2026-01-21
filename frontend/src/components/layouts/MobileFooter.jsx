import React from "react";
import { NavLink } from "react-router-dom";
import { IconHome, IconShop, IconStats, IconProfile } from "../icons/Icons"; 

export default function MobileFooter() {
  // Función para clases dinámicas limpia
  const getLinkClass = ({ isActive }) => {
    const base = "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200";
    const activeState = "text-primary scale-105 font-bold";
    const inactiveState = "text-muted-foreground hover:text-foreground hover:bg-muted/20";
    
    return `${base} ${isActive ? activeState : inactiveState}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-50 h-16 pb-safe">
      <nav className="flex justify-around items-center h-full px-2">
        
        {/* 1. ENTRENAR */}
        <NavLink to="/" className={getLinkClass}>
          <IconHome className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Entrenar</span>
        </NavLink>

        {/* 2. PRODUCTOS */}
        <NavLink to="/products" className={getLinkClass}>
          <IconShop className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Tienda</span>
        </NavLink>

        {/* 3. ESTADÍSTICA */}
        <NavLink to="/stats" className={getLinkClass}>
          <IconStats className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Progreso</span>
        </NavLink>

        {/* 4. PERFIL */}
        <NavLink to="/profile" className={getLinkClass}>
           <IconProfile className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Perfil</span>
        </NavLink>

      </nav>
    </footer>
  );
}