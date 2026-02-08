import React, { useState, useEffect, useMemo } from "react";
import { IconTrophy, IconLoader, IconRotate } from "../../components/icons/Icons"; 
import { API_URL } from "../../config/api";
import { getMuscleColor } from "../../config/ranksColors"; 

import BodyFront from "../../components/shared/BodyFront"; 
import BodyBack from "../../components/shared/BodyBack"; 

export default function MobileStatistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]); 
  const [view, setView] = useState("front"); 

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
      }
    } catch (error) {
      console.error("Error cargando stats:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) return <div className="h-full flex items-center justify-center"><IconLoader className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      
      {/* FONDO AMBIENTAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* BARRA DE HERRAMIENTAS FLOTANTE SUPERIOR */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 items-end">
        
        {/* Nivel */}
        <div className="bg-card/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <IconTrophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[11px] font-bold text-foreground">Nivel 12</span>
        </div>

        {/* Botón Rotar */}
        <button 
            onClick={() => setView(prev => prev === "front" ? "back" : "front")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-card/60 backdrop-blur-md border border-white/10 shadow-lg active:scale-95 transition-all text-primary hover:bg-primary hover:text-white"
        >
            <IconRotate className="w-5 h-5" />
        </button>
      </div>

      {/* TÍTULO DISCRETO (Izquierda) */}
      <div className="absolute top-6 left-6 z-10 opacity-80">
         <h2 className="text-lg font-black tracking-tighter italic uppercase text-foreground/80">Oxyra</h2>
      </div>

      {/* VISUALIZADOR 3D GIGANTE */}
      <div className="flex-1 w-full h-full flex items-center justify-center z-0">
        {/* max-h-[85vh] para aprovechar al máximo la pantalla vertical */}
        <div className="relative w-full h-full max-h-[85vh] p-0 transition-all duration-700 animate-in fade-in zoom-in-95 flex items-center justify-center">
            {view === "front" ? (
                <BodyFront colors={muscleColors} />
            ) : (
                <BodyBack colors={muscleColors} />
            )}
        </div>
      </div>

      {/* LEYENDA FLOTANTE INFERIOR */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center z-10 pointer-events-none">
         <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border border-white/5 pointer-events-auto">
            <LegendItem color="bg-zinc-700" label="Base" />
            <LegendItem color="bg-amber-400" label="Fuerte" />
            <LegendItem color="bg-blue-400" label="Élite" />
         </div>
      </div>

    </div>
  );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
    );
}