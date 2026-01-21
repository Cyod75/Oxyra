import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Importamos useLocation
import MobileHeader from "../components/layouts/MobileHeader";
import MobileFooter from "../components/layouts/MobileFooter";

export default function MobileView() {
  const location = useLocation();
  // Detectamos si estamos en la página de perfil
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo arriba: Solo se muestra si NO es la página de perfil */}
      {!isProfilePage && (
        <div className="fixed top-0 w-full z-50 bg-base-100">
          <MobileHeader />
        </div>
      )}

      {/* Contenido dinámico */}
      {/* Si es perfil quitamos el padding superior (pt-0), si no, dejamos el espacio del header (pt-20) */}
      <main className={`grow ${isProfilePage ? 'pt-0' : 'pt-20'} pb-24 px-4 overflow-y-auto`}>
        <div className="mt-4">
          <Outlet />
        </div>
      </main>

      {/* Footer fijo abajo */}
      <MobileFooter />
    </div>
  );
}