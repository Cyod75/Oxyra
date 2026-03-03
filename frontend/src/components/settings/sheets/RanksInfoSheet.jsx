import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RANK_COLORS } from "../../../config/ranksColors";
import { IconAlertCircle, IconTrophy } from "../../icons/Icons";

const RANKS = [
    { name: "Oxyra", desc: "Nivel Legendario. Rendimiento máximo absoluto.", color: RANK_COLORS["Oxyra"] },
    { name: "Campeon", desc: "Casi insuperable. Dominancia total del movimiento.", color: RANK_COLORS["Campeon"] },
    { name: "Diamante", desc: "Élite. Técnica y fuerza sobresalientes.", color: RANK_COLORS["Diamante"] },
    { name: "Esmeralda", desc: "Avanzado. Gran balance muscular.", color: RANK_COLORS["Esmeralda"] },
    { name: "Platino", desc: "Experto. Superando límites convencionales.", color: RANK_COLORS["Platino"] },
    { name: "Oro", desc: "Competente. Buena base atlética.", color: RANK_COLORS["Oro"] },
    { name: "Plata", desc: "Intermedio. En proceso de optimización.", color: RANK_COLORS["Plata"] },
    { name: "Bronce", desc: "Iniciante. Cimentando las bases.", color: RANK_COLORS["Bronce"] },
    { name: "Hierro", desc: "Básico. Primeros pasos biometría.", color: RANK_COLORS["Hierro"] },
    { name: "Sin Rango", desc: "Sin datos suficientes.", color: RANK_COLORS["Sin Rango"] }
];

export default function RanksInfoSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80%] rounded-t-[32px] px-6 bg-background border-t border-border focus:outline-none overflow-y-auto">
        
        <SheetHeader className="mb-8 mt-4 text-left">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconAlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <SheetTitle className="text-xl font-black italic uppercase tracking-tight">Sistema de Rangos</SheetTitle>
                    <SheetDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        Cómo medimos tu evolución
                    </SheetDescription>
                </div>
            </div>
        </SheetHeader>

        <div className="space-y-8 pb-12">
            
            <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ¿Cómo se calcula?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                    Tu rango en cada grupo muscular se basa en la progresión de cargas, la frecuencia de entrenamiento y la intensidad detectada en tus sesiones durante los últimos 30 días.
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Jerarquía Biométrica
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                    {RANKS.map((rank, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                            <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: rank.color + '15', border: `1px solid ${rank.color}30` }}
                            >
                                <IconTrophy style={{ color: rank.color }} className="w-5 h-5 shadow-sm" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-sm uppercase italic tracking-tighter" style={{ color: rank.color }}>
                                    {rank.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-medium leading-tight">
                                    {rank.desc}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[11px] text-primary font-bold italic text-center">
                    "La constancia es el único camino hacia el rango Oxyra."
                </p>
            </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
