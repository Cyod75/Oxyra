import React from "react";
import { NavLink } from "react-router-dom";
// Ajusta la ruta a donde guardaste el Icons.jsx
import { IconHome, IconShop, IconStats, IconProfile } from "../icons/Icons"; 

export default function MobileFooter() {
  const getLinkClass = ({ isActive }) => 
    `flex flex-col items-center justify-center p-2 transition duration-200 ${
      isActive ? "text-primary scale-110" : "text-base-content/60 hover:text-base-content"
    }`;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-base-100 border-t border-base-300 z-50 pb-safe">
      <nav className="flex justify-around items-center py-3">
        
        {/* 1. ENTRENAR (Home) */}
        <NavLink to="/" className={getLinkClass}>
          <IconHome />
          <span className="text-xs mt-1 font-medium">Entrenar</span>
        </NavLink>

        {/* 2. PRODUCTOS */}
        <NavLink to="/products" className={getLinkClass}>
          <IconShop />
          <span className="text-xs mt-1 font-medium">Productos</span>
        </NavLink>

        {/* 3. ESTADÍSTICA */}
        <NavLink to="/stats" className={getLinkClass}>
          <IconStats />
          <span className="text-xs mt-1 font-medium">Estadística</span>
        </NavLink>

        {/* 4. PERFIL */}
        <NavLink to="/profile" className={getLinkClass}>
           <IconProfile />
          <span className="text-xs mt-1 font-medium">Perfil</span>
        </NavLink>

      </nav>
    </footer>
  );
}