import React from "react";

export default function MobileTraining() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Sección Entrenar</h1>
      
      <div className="grid gap-3">
        {/* Ejemplo de tarjeta de entrenamiento */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body p-4 flex flex-row items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-box text-primary">
                <span className="font-bold text-xl">{item}</span>
              </div>
              <div>
                <h3 className="font-bold">Rutina {item}</h3>
                <p className="text-xs opacity-70">20 min • Alta intensidad</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}