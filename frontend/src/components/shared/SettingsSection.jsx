import React from 'react';

export default function SettingsSection({ title, children }) {
  return (
    <section>
      {/* Título de la sección en mayúsculas y gris */}
      <h3 className="text-sm font-bold text-base-content/50 uppercase mb-2 ml-1">
        {title}
      </h3>
      
      {/* Contenedor redondeado para las opciones */}
      <div className="flex flex-col bg-base-200 rounded-box shadow-sm overflow-hidden">
        {children}
      </div>
    </section>
  );
}