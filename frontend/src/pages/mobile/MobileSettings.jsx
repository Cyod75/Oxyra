import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// SHADCN
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Tu componente corregido
import ThemeController from "../../components/shared/ThemeController";

// Iconos
import {
  IconBackArrow, IconUser, IconLock, IconCrown, IconLogout,
  IconPalette, IconWeight, IconTimer, IconTrash, IconChevronRight
} from "../../components/icons/Icons";

export default function MobileSettings() {
  const navigate = useNavigate();
  const [weightUnit, setWeightUnit] = useState("kg");

  return (
    // Fondo base negro neutro
    <div className="flex flex-col h-screen bg-background text-foreground">
      
      {/* HEADER GLASSMORPHISM */}
      <header className="fixed top-0 w-full glass z-50 h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10">
            <IconBackArrow className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-tight">Configuración</h1>
        </div>
      </header>

      {/* CONTENIDO */}
      <ScrollArea className="h-full pt-16 pb-6 w-full">
        <div className="px-4 space-y-6">
          
          {/* SECCIÓN CUENTA */}
          <Section title="Tu Cuenta">
            <Row icon={<IconUser />} label="Datos Personales" sub="Nombre, Email" />
            <Row icon={<IconLock />} label="Seguridad" sub="Contraseña, 2FA" />
            <Row 
              icon={<IconCrown className="text-amber-400" />} 
              label="Suscripción Pro" 
              right={<Badge className="bg-gradient-to-r from-amber-400 to-orange-500 border-0 text-black font-bold">PRO</Badge>} 
            />
          </Section>

          {/* SECCIÓN APARIENCIA (Aquí arreglamos el ThemeController) */}
          <Section title="Experiencia">
            {/* Fila personalizada para el Tema */}
            <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <IconPalette className="h-5 w-5"/>
                 </div>
                 <span className="font-medium text-sm">Tema Visual</span>
               </div>
               {/* Aquí insertamos el controlador nuevo */}
               <ThemeController />
            </div>
            
            <div className="h-[1px] bg-border mx-4" /> {/* Separador manual sutil */}
            
            <Row 
              icon={<IconWeight />} 
              label="Unidad de Peso" 
              right={
                <Button variant="outline" size="sm" onClick={() => setWeightUnit(w => w === 'kg' ? 'lbs' : 'kg')} className="h-7 px-3 text-xs font-mono border-white/20 bg-transparent">
                  {weightUnit.toUpperCase()}
                </Button>
              } 
            />
          </Section>

          <Section title="Zona de Peligro">
            <Row 
               icon={<IconLogout />} 
               label="Cerrar Sesión" 
               className="text-red-400 hover:text-red-300"
               iconClass="text-red-400 bg-red-500/10"
               onClick={() => { localStorage.removeItem("authToken"); navigate("/welcome"); }} 
            />
             <Row 
               icon={<IconTrash />} 
               label="Eliminar Cuenta" 
               className="text-red-400 hover:text-red-300"
               iconClass="text-red-400 bg-red-500/10"
               onClick={() => alert("Eliminar")} 
            />
          </Section>

          <div className="text-center text-xs text-muted-foreground pt-4 pb-10 opacity-50">
            Oxyra v1.2.0 • Build 4502
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Subcomponente de Sección con estilo "Card Flotante"
function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">{title}</h3>
      {/* Card contenedor con bordes sutiles y fondo negro transparente */}
      <div className="border border-white/10 rounded-2xl bg-card overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

// Subcomponente de Fila
function Row({ icon, label, sub, right, onClick, className = "", iconClass = "bg-secondary text-foreground" }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${className}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}>
           {React.cloneElement(icon, { className: "h-5 w-5" })}
        </div>
        <div className="flex flex-col truncate">
          <span className="font-medium text-sm">{label}</span>
          {sub && <span className="text-xs text-muted-foreground mt-0.5">{sub}</span>}
        </div>
      </div>
      {right ? right : <IconChevronRight className="h-4 w-4 text-muted-foreground/50" />}
    </div>
  );
}