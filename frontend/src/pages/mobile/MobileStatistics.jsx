import React from "react";

export default function MobileStatistics() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mis Estadísticas</h1>
      
      <div className="stats stats-vertical shadow w-full bg-base-200">
        <div className="stat">
          <div className="stat-title">Calorías Totales</div>
          <div className="stat-value text-primary">2,400</div>
          <div className="stat-desc">21% más que el mes pasado</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Entrenamientos</div>
          <div className="stat-value">12</div>
          <div className="stat-desc">Esta semana</div>
        </div>
      </div>
    </div>
  );
}