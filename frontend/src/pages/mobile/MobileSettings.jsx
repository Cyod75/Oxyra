import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; 

// Custom Components
import SettingsSection from "../../components/settings/SettingsSection";
import SettingsRow from "../../components/settings/SettingsRow";
import ThemeController from "../../components/shared/ThemeController";

// Sheets (Popups)
import SecuritySheet from "../../components/settings/sheets/SecuritySheet";
import ProfileSheet from "../../components/settings/sheets/ProfileSheet";
import SubscriptionSheet from "../../components/settings/sheets/SubscriptionSheet";
import NotificationSheet from "../../components/settings/sheets/NotificationSheet";

// Hooks
import { useSubscription } from "../../hooks/useSubscription";
import { useNotifications } from "../../hooks/useNotifications";
import BackButton from "../../components/shared/BackButton";

// Iconos
import {
  IconBackArrow, IconUser, IconLock, IconLogout,
  IconPalette, IconWeight, IconTrash, IconBell,
  IconSparkles
} from "../../components/icons/Icons";

// Icono de carga simple (Spinner)
const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent text-muted-foreground" />
);

export default function MobileSettings() {
  const navigate = useNavigate();
  
  // -- HOOKS --
  const { isPro, daysLeft, loading: subLoading, handleSubscribe, handleCancel } = useSubscription();
  const { notificationsEnabled, loading: notifLoading, toggleNotifications } = useNotifications();

  // Estados UI
  const [weightUnit, setWeightUnit] = useState(() => localStorage.getItem("oxyra_weight_unit") || "kg");
  
  // Control de Sheets
  const [showProfile, setShowProfile] = useState(false);     
  const [showSecurity, setShowSecurity] = useState(false); 
  const [showSubscription, setShowSubscription] = useState(false);
  const [showNotificationConfirm, setShowNotificationConfirm] = useState(false);

  // Lógica del Click en Notificaciones (CORREGIDA)
  const handleNotificationClick = () => {
      // 1. BLOQUEO ANTI-SPAM: Si ya está cargando, no hacemos nada
      if (notifLoading) return;

      if (notificationsEnabled) {
          // Si están activas, queremos desactivar -> MOSTRAR POPUP
          setShowNotificationConfirm(true);
      } else {
          // Si están desactivadas, activar directamente
          toggleNotifications(true);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground animate-in fade-in duration-300 relative">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full glass z-50 h-14 flex items-center px-4 justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-lg font-bold tracking-tight">Configuración</h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <ScrollArea className="h-full pt-16 pb-6 w-full">
        <div className="px-4">
          
          <SettingsSection title="Tu Cuenta">
            <SettingsRow 
              icon={<IconSparkles className={isPro ? "text-white" : "text-blue-500"} />} 
              label={isPro ? "Gestionar Suscripción" : "Oxyra Pro"} 
              sub={isPro ? `Renueva en ${daysLeft} días` : "Sube de nivel tu físico"}
              iconClass={isPro 
                  ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-blue-500/50 shadow-sm" 
                  : "bg-blue-500/10 text-blue-500"}
              right={isPro && <Badge className="bg-blue-500 text-white border-0 hover:bg-blue-600">PRO</Badge>}
              onClick={() => setShowSubscription(true)}
            />
            <SettingsRow icon={<IconUser />} label="Datos Personales" sub="Físico, Nombre, Foto" onClick={() => setShowProfile(true)} />
            <SettingsRow icon={<IconLock />} label="Seguridad" sub="Cambiar contraseña" onClick={() => setShowSecurity(true)} />
          </SettingsSection>

          <SettingsSection title="Experiencia">
            <div className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b border-border/40 last:border-0">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 shrink-0"><IconPalette className="h-5 w-5"/></div>
                 <span className="font-medium text-sm">Tema Visual</span>
               </div>
               <ThemeController />
            </div>
            
            <SettingsRow 
              icon={<IconWeight />} label="Unidad de Peso" iconClass="bg-emerald-500/10 text-emerald-500"
              right={
                <Button variant="outline" size="sm" onClick={() => {
                      const nu = weightUnit === 'kg' ? 'lbs' : 'kg';
                      setWeightUnit(nu);
                      localStorage.setItem("oxyra_weight_unit", nu);
                  }} className="h-7 px-3 text-xs font-mono border-muted-foreground/20 bg-transparent hover:bg-muted">
                  {weightUnit.toUpperCase()}
                </Button>
              } 
            />
             
             {/* ROW DE NOTIFICACIONES */}
             <SettingsRow 
                icon={<IconBell />} 
                label="Notificaciones" 
                // Cambia la opacidad si está cargando para dar feedback visual
                className={notifLoading ? "opacity-70 cursor-wait" : ""}
                iconClass={notificationsEnabled ? "bg-pink-500 text-white" : "bg-pink-500/10 text-pink-500"}
                onClick={handleNotificationClick}
                right={
                    // 2. FEEDBACK VISUAL: Si carga mostramos spinner, si no el switch
                    notifLoading ? (
                        <Spinner />
                    ) : (
                        <Switch 
                            checked={notificationsEnabled} 
                            className="pointer-events-none" 
                        />
                    )
                }
             />
          </SettingsSection>

          <SettingsSection title="Zona de Peligro">
            <SettingsRow 
              icon={<IconLogout />} label="Cerrar Sesión" isDestructive 
              onClick={() => { localStorage.removeItem("authToken"); navigate("/welcome"); }} 
            />
             <SettingsRow 
              icon={<IconTrash />} label="Eliminar Cuenta" isDestructive 
              onClick={() => alert("Pendiente de implementar")} 
            />
          </SettingsSection>

          <div className="text-center space-y-1 pt-4 pb-10 opacity-50">
            <p className="text-xs font-bold">Oxyra App</p>
            <p className="text-[10px] text-muted-foreground">v1.2.0 • Build 4502</p>
          </div>
        </div>
      </ScrollArea>

      {/* SHEETS */}
      <SecuritySheet open={showSecurity} onOpenChange={setShowSecurity} />
      <ProfileSheet open={showProfile} onOpenChange={setShowProfile} />
      <SubscriptionSheet 
        open={showSubscription} 
        onOpenChange={setShowSubscription}
        isPro={isPro}
        daysLeft={daysLeft}
        loading={subLoading}
        onSubscribe={handleSubscribe}
        onCancel={handleCancel}
      />
      
      <NotificationSheet 
        open={showNotificationConfirm}
        onOpenChange={setShowNotificationConfirm}
        loading={notifLoading}
        onConfirmDisable={() => {
            toggleNotifications(false).then(() => setShowNotificationConfirm(false));
        }}
      />

    </div>
  );
}