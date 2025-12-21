import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Añadido useLocation

// Componentes UI - Rutas relativas desde src/pages/mobile
import ThemeController from "../../components/shared/ThemeController";
import SettingsSection from "../../components/shared/SettingsSection";
import SettingsRow from "../../components/shared/SettingsRow";

// Iconos
import {
  IconBackArrow,
  IconUser,
  IconLock,
  IconCrown,
  IconLogout,
  IconPalette,
  IconWeight,
  IconTimer,
  IconSound,
  IconDiscord,
  IconInstagram,
  IconHeart,
  IconDoc,
  IconTrash,
} from "../../components/icons/Icons";

export default function MobileSettings() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para leer el estado de navegación
  const [weightUnit, setWeightUnit] = useState("kg");

  // Lógica de navegación robusta
  const handleBack = () => {
    // Si venimos de una ruta válida (ej: clic en icono header), volvemos ahí
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      // Si el usuario refrescó (F5) o entró directo, vamos al Home para evitar bucles
      navigate("/");
    }
  };

  const toggleWeightUnit = () => {
    setWeightUnit((prev) => (prev === "kg" ? "lbs" : "kg"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      {/* --- HEADER SETTINGS --- */}
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
          <SettingsRow icon={<IconLock />} label="Cambiar contraseña" />
          <Divider />
          <SettingsRow
            icon={<IconCrown />}
            label="Tu Suscripción"
            rightElement={
              <span className="badge badge-primary badge-sm">Pro</span>
            }
          />
          <Divider />
          <SettingsRow
            icon={<IconLogout />}
            label="Cerrar Sesión"
            isDestructive={true}
            onClick={() => alert("Lógica de logout")}
          />
        </SettingsSection>

        {/* 2. SECCIÓN PERSONALIZACIÓN */}
        <SettingsSection title="Personalización">
          <div className="flex items-center justify-between p-4 hover:bg-base-100 transition duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="opacity-70">
                <IconPalette />
              </span>
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

        {/* 3. ENTRENAMIENTO */}
        <SettingsSection title="Entrenamiento">
          <SettingsRow
            icon={<IconTimer />}
            label="Descanso por defecto"
            rightElement={
              <span className="text-xs opacity-50 font-bold">2:00</span>
            }
          />
          <Divider />
          <SettingsRow
            icon={<IconSound />}
            label="Sonidos del temporizador"
            rightElement={
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                defaultChecked
              />
            }
          />
        </SettingsSection>

        {/* 4. COMUNIDAD */}
        <SettingsSection title="Comunidad">
          <SettingsRow
            icon={<IconDiscord />}
            label="Únete a nuestro Discord"
            rightElement={
              <span className="text-xs text-indigo-400 font-bold">Unirse</span>
            }
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

        {/* 6. ZONA DE PELIGRO */}
        <SettingsSection title="Zona de Peligro">
          <SettingsRow
            icon={<IconTrash />}
            label="Eliminar Cuenta"
            isDestructive={true}
            onClick={() => alert("Lógica de eliminar cuenta")}
          />
        </SettingsSection>

        <p className="text-center text-xs opacity-40 mt-4 pb-6">Oxyra v1.0.0</p>
      </main>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-base-300 w-full"></div>;
}