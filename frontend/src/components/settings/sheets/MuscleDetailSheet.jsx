import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MUSCLE_EXERCISES } from "../../../config/muscleData";
import { RANK_COLORS } from "../../../config/ranksColors";
import { IconDumbbell, IconTrophy } from "../../icons/Icons";

export default function MuscleDetailSheet({ open, onOpenChange, muscle, stats }) {
  if (!muscle) return null;

  const muscleStat = stats.find(s => s.grupo_muscular === muscle) || {
    rango_actual: "Sin Rango",
    nivel_actual: 0,
    progreso: 0
  };

  const exercises = MUSCLE_EXERCISES[muscle] || [];
  const rankColor = RANK_COLORS[muscleStat.rango_actual] || RANK_COLORS["Sin Rango"];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70%] rounded-t-[32px] px-6 bg-background border-t border-border focus:outline-none overflow-y-auto">
        
        <SheetHeader className="mb-8 mt-4 text-left">
            <div className="flex items-center gap-4">
                <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: rankColor + '20', border: `1px solid ${rankColor}40` }}
                >
                    <IconTrophy style={{ color: rankColor }} className="w-6 h-6" />
                </div>
                <div>
                    <SheetTitle className="text-2xl font-black italic uppercase tracking-tighter">
                        {muscle}
                    </SheetTitle>
                    <SheetDescription className="font-bold text-xs uppercase tracking-widest text-muted-foreground/60">
                        Análisis Biomecánico
                    </SheetDescription>
                </div>
            </div>
        </SheetHeader>

        <div className="space-y-8 pb-12">
            {/* STATS SECTION */}
            <div className="grid grid-cols-2 gap-4">
                <StatBox 
                    label="Rango Actual" 
                    value={muscleStat.rango_actual} 
                    color={rankColor}
                    subValue={`Nivel ${muscleStat.nivel_actual || 1}`}
                />
                <StatBox 
                    label="Potencial" 
                    value="Elite" 
                    color="#60a5fa"
                    subValue="Próximo Hito"
                />
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progreso de Rango</span>
                    <span className="text-xs font-bold text-foreground">75%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: '75%', backgroundColor: rankColor }}
                    />
                </div>
            </div>

            {/* RECOMMENDED EXERCISES */}
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <IconDumbbell className="w-3 h-3" />
                    Ejercicios Optimizados
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {exercises.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 group active:scale-[0.98] transition-all">
                            <span className="font-bold text-sm text-foreground/80">{ex}</span>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatBox({ label, value, color, subValue }) {
    return (
        <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">{label}</span>
            <span className="text-lg font-black block" style={{ color }}>{value}</span>
            <span className="text-[10px] font-medium text-muted-foreground/60 block">{subValue}</span>
        </div>
    );
}
