import React from "react";
import { NavLink } from "react-router-dom";
import { IconHome, IconShop, IconStats, IconProfile } from "../icons/Icons"; 

export default function MobileFooter() {
  const getLinkClass = ({ isActive }) => {
    return `flex flex-col items-center justify-center group transition-colors duration-300 ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-xl dark:shadow-2xl shadow-zinc-500/10 dark:shadow-black/50 overflow-hidden">
      <nav className="flex items-center justify-between px-6 py-2" role="menubar">
        
        <NavLink to="/" className={getLinkClass} aria-label="Entrenar">
          {({ isActive }) => (
            <>
              <IconHome className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Entrenar</span>
            </>
          )}
        </NavLink>

        <NavLink to="/products" className={getLinkClass} aria-label="Tienda">
          {({ isActive }) => (
            <>
              <IconShop className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Tienda</span>
            </>
          )}
        </NavLink>

        <NavLink to="/stats" className={getLinkClass} aria-label="Progreso">
          {({ isActive }) => (
            <>
              <IconStats className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Progreso</span>
            </>
          )}
        </NavLink>

        <NavLink to="/profile" className={getLinkClass} aria-label="Perfil">
          {({ isActive }) => (
            <>
              <IconProfile className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Perfil</span>
            </>
          )}
        </NavLink>

      </nav>
    </footer>
  );
}