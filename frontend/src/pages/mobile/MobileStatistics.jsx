import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconTimer, IconWeight } from "../../components/icons/Icons"; // Usa tus iconos

export default function MobileStatistics() {
  return (
    <div className="space-y-4 p-4 pb-24">
      <h1 className="text-2xl font-bold tracking-tight">Tu Progreso</h1>
      
      {/* Tarjeta Principal Destacada */}
      <Card className="bg-gradient-to-br from-primary/20 to-background border-primary/20">
        <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-primary uppercase">Volumen Total</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-4xl font-black tracking-tighter">24,500 <span className="text-lg font-normal text-muted-foreground">kg</span></div>
           <p className="text-xs text-emerald-500 font-bold mt-1">+12% vs semana pasada</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
         <StatsCard title="Entrenos" value="12" icon={<IconTimer />} />
         <StatsCard title="Duración" value="14h" icon={<IconWeight />} />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }) {
   return (
     <Card>
       <CardContent className="p-4 flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
             <span className="text-xs font-bold text-muted-foreground uppercase">{title}</span>
             <span className="opacity-20">{icon}</span>
          </div>
          <span className="text-2xl font-bold">{value}</span>
       </CardContent>
     </Card>
   )
}