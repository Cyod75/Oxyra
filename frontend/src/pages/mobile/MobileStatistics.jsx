import React, { useState, useEffect, useMemo } from "react";
import { IconRotate, IconLoader, IconAlertCircle } from "../../components/icons/Icons"; 
import { API_URL } from "../../config/api";
import { getMuscleColor } from "../../config/ranksColors"; 

import BodyFront from "../../components/shared/BodyFront"; 
import BodyBack from "../../components/shared/BodyBack"; 
import MuscleDetailSheet from "../../components/settings/sheets/MuscleDetailSheet";
import RanksInfoSheet from "../../components/settings/sheets/RanksInfoSheet";
import PhysiqueScanSheet from "../../components/settings/sheets/PhysiqueScanSheet";
import ModernLoader from "../../components/shared/ModernLoader";

// Icono de escáner personalizado para el botón
const IconScan = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

export default function MobileStatistics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState([]); 
  const [view, setView] = useState("front"); 
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isInfoSheetOpen, setIsInfoSheetOpen] = useState(false);
  const [isScanSheetOpen, setIsScanSheetOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.muscularStats || []);
        setTimeout(() => setLoading(false), 900);
      } else {
        throw new Error("Error fetching stats");
      }
    } catch (error) {
      console.error("Error cargando stats:", error);
      setError(true);
    } 
  };

  const handleMuscleClick = (muscle) => {
    setSelectedMuscle(muscle);
    setIsSheetOpen(true);
  };

  const muscleColors = useMemo(() => {
    const map = {};
    const muscles = [
        'Pecho', 'Espalda Alta', 'Espalda Media', 'Espalda Baja', 'Hombro', 'Trapecio',
        'Cuadriceps', 'Femoral', 'Gluteo', 'Gemelo', 'Aductores',
        'Bíceps', 'Tríceps', 'Antebrazo', 'Abdomen'
    ];
    muscles.forEach(m => map[m] = getMuscleColor(stats, m));
    return map;
  }, [stats]);

  if (loading || error) return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden">
        <ModernLoader text={error ? "ERROR DE CONEXIÓN" : "SINCRONIZANDO BIOMETRÍA..."} />
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden animate-in fade-in duration-500">
      
      {/* --- UNIFIED CONTROL CAPSULE --- */}
      <div className="absolute right-6 top-6 z-30">
        <div className="flex flex-col gap-1 p-1 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/50 shadow-sm">
            
            {/* Info Button */}
            <button 
                onClick={() => setIsInfoSheetOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground transition-all hover:text-primary hover:bg-background/50 active:scale-95"
            >
                <IconAlertCircle className="w-5 h-5" />
            </button>
            
            {/* Divider */}
            <div className="h-px w-full px-2">
                <div className="h-full w-full bg-border/50" />
            </div>

            {/* AI Scan Button */}
            <button 
                onClick={() => setIsScanSheetOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground transition-all hover:text-blue-500 hover:bg-blue-500/10 active:scale-95 relative group"
                title="Escaneo Corporal IA"
            >
                <IconScan className="w-5 h-5" />
                {/* PRO dot indicator */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-background" />
            </button>

            {/* Divider */}
            <div className="h-px w-full px-2">
                <div className="h-full w-full bg-border/50" />
            </div>

            {/* Rotate Button */}
            <button 
                onClick={() => setView(prev => prev === "front" ? "back" : "front")}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground transition-all hover:text-foreground hover:bg-background/50 active:scale-95"
            >
                <IconRotate className={`w-5 h-5 transition-transform duration-500 ${view === 'back' ? 'rotate-180' : ''}`} />
            </button>

        </div>
      </div>

      {/* --- MAIN CHARACTER STAGE --- */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6 pt-10 pb-20">
        
        {/* Sombra de Contacto Sutil */}
        <div className="absolute bottom-[12%] w-[40%] h-[15px] bg-black/10 blur-xl rounded-full pointer-events-none dark:bg-black/30" />

        <div className="relative w-full h-full max-h-[82vh] scale-105 flex items-center justify-center transition-all duration-700 animate-in zoom-in-95 fill-mode-both origin-center">
            {view === "front" ? (
                <BodyFront colors={muscleColors} onMuscleClick={handleMuscleClick} />
            ) : (
                <BodyBack colors={muscleColors} onMuscleClick={handleMuscleClick} />
            )}
        </div>
      </div>


      {/* --- SHEETS & MODALS --- */}
      <MuscleDetailSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        muscle={selectedMuscle} 
        stats={stats} 
      />
      
      <RanksInfoSheet 
        open={isInfoSheetOpen} 
        onOpenChange={setIsInfoSheetOpen} 
      />

      <PhysiqueScanSheet
        open={isScanSheetOpen}
        onOpenChange={setIsScanSheetOpen}
        onScanComplete={fetchStats}
      />

    </div>
  );
}
