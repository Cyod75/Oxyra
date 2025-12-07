import React from "react";

export default function MobileProfile() {
  return (
    <div className="flex flex-col items-center">
      <div className="avatar placeholder mb-4">
        <div className="bg-neutral text-neutral-content rounded-full w-24">
          <span className="text-3xl">U</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Usuario Móvil</h1>
      <p className="opacity-60 mb-6">usuario@oxyra.app</p>
      
      <div className="w-full space-y-2">
        <button className="btn btn-outline w-full justify-start">Editar Perfil</button>
        <button className="btn btn-outline w-full justify-start">Notificaciones</button>
        <button className="btn btn-error btn-outline w-full justify-start">Cerrar Sesión</button>
      </div>
    </div>
  );
}