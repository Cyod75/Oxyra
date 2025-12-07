import React from "react";
import { NavLink } from "react-router-dom";

export default function MobileFooter() {
  // Función helper para clases condicionales
  const getLinkClass = ({ isActive }) => 
    `flex flex-col items-center justify-center p-2 transition duration-200 ${
      isActive ? "text-primary scale-110" : "text-base-content/60 hover:text-base-content"
    }`;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-base-100 border-t border-base-300 z-50 pb-safe">
      <nav className="flex justify-around items-center py-3">
        
        {/* 1. ENTRENAR (Home) */}
        <NavLink to="/" className={getLinkClass}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z"/>
          </svg>
          <span className="text-xs mt-1 font-medium">Entrenar</span>
        </NavLink>

        {/* 2. PRODUCTOS */}
        <NavLink to="/products" className={getLinkClass}>
          {/* Icono de bolsa/tienda (Placeholder SVG - he reutilizado uno genérico tuyo o puedes poner uno de tienda real) */}
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
          </svg>
          <span className="text-xs mt-1 font-medium">Productos</span>
        </NavLink>

        {/* 3. ESTADÍSTICA */}
        <NavLink to="/stats" className={getLinkClass}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/>
          </svg>
          <span className="text-xs mt-1 font-medium">Estadística</span>
        </NavLink>

        {/* 4. PERFIL */}
        <NavLink to="/profile" className={getLinkClass}>
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
             <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
           </svg>
          <span className="text-xs mt-1 font-medium">Perfil</span>
        </NavLink>

      </nav>
    </footer>
  );
}