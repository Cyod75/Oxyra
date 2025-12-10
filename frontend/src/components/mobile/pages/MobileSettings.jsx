import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Ajusta esta ruta si es necesario según donde tengas tu ThemeController
import ThemeController from "../../shared/ThemeController"; 

export default function MobileSettings() {
  const navigate = useNavigate();
  const [weightUnit, setWeightUnit] = useState("kg");

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const toggleWeightUnit = () => {
    setWeightUnit((prev) => (prev === "kg" ? "lbs" : "kg"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full bg-base-100 border-b border-base-200 z-50 h-16 flex items-center justify-center px-4">
        <button
          onClick={handleBack}
          className="btn btn-ghost btn-circle btn-sm absolute left-4"
          aria-label="Volver"
        >
          <IconBackArrow />
        </button>
        <h1 className="text-xl font-bold">Configuración</h1>
      </header>

      {/* --- CONTENIDO --- */}
      <main className="grow pt-20 px-4 pb-10 space-y-6 overflow-y-auto">

        {/* 1. SECCIÓN CUENTA */}
        <SettingsSection title="Cuenta">
          <SettingsRow 
            icon={<IconUser />} 
            label="Información de la cuenta" 
            subLabel="Nombre, Email, Foto"
          />
          <Divider />
          <SettingsRow 
            icon={<IconLock />} 
            label="Cambiar contraseña" 
          />
          <Divider />
          <SettingsRow 
            icon={<IconCrown />} 
            label="Tu Suscripción" 
            rightElement={<span className="badge badge-primary badge-sm">Pro</span>}
          />
          <Divider />
          {/* Botón Cerrar Sesión (Estilo Destructivo) */}
          <SettingsRow 
            icon={<IconLogout />} 
            label="Cerrar Sesión" 
            isDestructive={true} 
            onClick={() => alert("Lógica de logout")}
          />
        </SettingsSection>

        {/* 2. SECCIÓN PERSONALIZACIÓN */}
        <SettingsSection title="Personalización">
          <div className="flex items-center justify-between p-4 bg-base-100/50 hover:bg-base-100 transition duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="opacity-70"><IconPalette /></span>
              <span className="font-medium">Tema Oscuro</span>
            </div>
            <ThemeController />
          </div>
          
          <Divider />
          
          <SettingsRow 
            icon={<IconWeight />} 
            label="Unidad de peso"
            rightElement={
              <button 
                onClick={toggleWeightUnit}
                className="btn btn-xs btn-outline font-bold min-w-12"
              >
                {weightUnit.toUpperCase()}
              </button>
            }
          />
        </SettingsSection>

        {/* 3. PREFERENCIAS DE ENTRENO */}
        <SettingsSection title="Entrenamiento">
          <SettingsRow 
            icon={<IconTimer />} 
            label="Descanso por defecto"
            rightElement={<span className="text-xs opacity-50 font-bold">2:00</span>}
          />
          <Divider />
          <SettingsRow 
            icon={<IconSound />} 
            label="Sonidos del temporizador"
            rightElement={<input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />}
          />
        </SettingsSection>

        {/* 4. COMUNIDAD */}
        <SettingsSection title="Comunidad">
          <SettingsRow 
            icon={<IconDiscord />} 
            label="Únete a nuestro Discord"
            rightElement={<span className="text-xs text-indigo-400 font-bold">Unirse</span>}
          />
          <Divider />
          <SettingsRow 
            icon={<IconInstagram />} 
            label="Síguenos"
            subLabel="@oxyra.app"
          />
          <Divider />
          <SettingsRow 
            icon={<IconHeart />} 
            label="Ayúdanos a mejorar"
            subLabel="Enviar feedback"
          />
        </SettingsSection>

        {/* 5. LEGAL */}
        <SettingsSection title="Legal">
          <SettingsRow icon={<IconDoc />} label="Política de Privacidad" />
          <Divider />
          <SettingsRow icon={<IconDoc />} label="Términos y Condiciones" />
        </SettingsSection>

        {/* 6. ZONA DE PELIGRO (MODIFICADO) */}
        {/* Ahora usa SettingsSection y SettingsRow igual que Cerrar Sesión */}
        <SettingsSection title="Zona de Peligro">
          <SettingsRow 
            icon={<IconTrash />} 
            label="Eliminar Cuenta"
            isDestructive={true} // Esto aplica el color rojo y el estilo de alerta
            onClick={() => alert("Lógica de eliminar cuenta")}
          />
        </SettingsSection>

        <p className="text-center text-xs opacity-40 mt-4 pb-6">
          Oxyra v1.0.0
        </p>

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES INTERNOS 
// ==========================================

function SettingsSection({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-bold text-base-content/50 uppercase mb-2 ml-1">
        {title}
      </h3>
      <div className="flex flex-col bg-base-200 rounded-box shadow-sm overflow-hidden">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({ icon, label, subLabel, rightElement, isDestructive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-4 w-full text-left transition-colors
        ${isDestructive 
          ? "text-error hover:bg-error/10" // Estilo rojo para logout/eliminar
          : "hover:bg-base-100/50 active:bg-base-200"
        }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {icon && <span className={`shrink-0 ${isDestructive ? "" : "opacity-70"}`}>{icon}</span>}
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{label}</span>
          {subLabel && <span className="text-xs opacity-60 truncate">{subLabel}</span>}
        </div>
      </div>
      
      <div className="pl-2 shrink-0">
        {rightElement ? rightElement : <IconChevronRight />}
      </div>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-base-300 w-full"></div>;
}

// ==========================================
// ICONOS SVG
// ==========================================

const IconBackArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className="opacity-40">
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
);

const IconCrown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m233-120 65-280-165-125 204-6 63-209 63 209 204 6-165 125 65 280-187-140-187 140Z"/></svg>
);

const IconPalette = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 18-2 35.5t-8 34.5l-68-66q6-31 6-77 0-111-73-191t-185-93v101l-160-56 94-142q-97 29-158.5 109T265-560h103l-149 149q51 98 143.5 164.5T600-166v84q-30 2-60 2Z"/></svg>
);

const IconWeight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>
);

const IconDiscord = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.616 1.267 18.32 18.32 0 0 0-5.474 0 13.568 13.568 0 0 0-.619-1.267.077.077 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
);

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
);

const IconDoc = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z"/></svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
);

const IconLogout = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
);

const IconTimer = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
);

const IconSound = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z"/></svg>
);