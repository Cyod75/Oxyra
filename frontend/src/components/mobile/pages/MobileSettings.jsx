import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeController from "../../shared/ThemeController";

export default function MobileSettings() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* --- HEADER --- */}
      {/* h-16 (64px) para más altura. relative + flex para centrar título */}
      <header className="fixed top-0 left-0 w-full bg-base-100 border-b border-base-200 z-50 h-16 flex items-center justify-center px-4">
        {/* Botón Volver: Absolute Left para no empujar el título */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle btn-sm absolute left-4"
          aria-label="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28px" // Un poco más grande
            viewBox="0 -960 960 960"
            width="28px"
            fill="currentColor"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>

        {/* Título Centrado */}
        <h1 className="text-xl font-bold">Configuración</h1>
      </header>

      {/* --- CONTENIDO --- */}
      {/* pt-20 para compensar el header más alto + un poco de aire */}
      <main className="grow pt-20 px-4 pb-6 space-y-6">
        {/* SECCIÓN 1: APARIENCIA */}
        <section>
          <h3 className="text-sm font-bold text-base-content/50 uppercase mb-2 ml-1">
            General
          </h3>
          <div className="flex flex-col bg-base-200 rounded-box shadow-sm overflow-hidden">
            {/* ÍTEM: TEMA (Una línea, alineado verticalmente) */}
            <div className="flex items-center justify-between p-4 bg-base-100/50 hover:bg-base-100 transition duration-200">
              <div className="flex flex-col">
                <span className="font-medium text-base">Apariencia</span>
                <span className="text-xs text-base-content/60">
                  Alternar modo oscuro
                </span>
              </div>

              {/* Aquí va el controller limpio */}
              <ThemeController />
            </div>

            {/* ÍTEM: Ejemplo de otro ajuste (separador visual si hubiera más) */}
            {/* <div className="divider my-0"></div> */}
          </div>
        </section>

        {/* SECCIÓN 2: CUENTA (Ejemplo de layout vertical) */}
        <section>
          <h3 className="text-sm font-bold text-base-content/50 uppercase mb-2 ml-1">
            Cuenta
          </h3>
          <div className="flex flex-col bg-base-200 rounded-box shadow-sm overflow-hidden">
            <button className="flex items-center justify-between p-4 w-full text-left bg-base-100/50 active:bg-base-200">
              <span className="font-medium">Notificaciones</span>
              <span className="text-xs text-base-content/40">Activado</span>
            </button>
            <div className="h-px bg-base-300 w-full"></div>{" "}
            {/* Separador manual fino */}
            <button className="flex items-center justify-between p-4 w-full text-left text-error bg-base-100/50 active:bg-base-200">
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
