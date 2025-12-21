import React from "react";
import { Outlet } from "react-router-dom"; // Importante
import ThemeController from "../components/shared/ThemeController";
import MobileHeader from "../components/layouts/MobileHeader";
import MobileFooter from "../components/layouts/MobileFooter";

export default function MobileView() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo arriba */}
      <div className="fixed top-0 w-full z-50 bg-base-100">
        <MobileHeader />
      </div>

      {/* Contenido dinámico (Aquí se cargan las pages) */}
      {/* Añadimos padding-top (pt-16) por el header y padding-bottom (pb-20) por el footer */}
      <main className="grow pt-20 pb-24 px-4 overflow-y-auto">
        <div className="mt-4">
          <Outlet />
        </div>
      </main>

      {/* Footer fijo abajo */}
      <MobileFooter />
    </div>
  );
}
