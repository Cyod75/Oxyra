import React from 'react';
import { IconChevronRight } from "../icons/Icons"; // Importar icono

export default function SettingsRow({ icon, label, subLabel, rightElement, isDestructive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-4 w-full text-left transition-colors
        ${isDestructive 
          ? "text-error hover:bg-error/10"
          : "hover:bg-base-100/50 active:bg-base-200"
        }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {icon && <span className={`shrink-0 ${isDestructive ? "" : "opacity-70"}`}>{icon}</span>}
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{label}</span>
          {subLabel && <span className="text-xs opacity-60 truncate">{subLabel}</span>}
        </div>
      </div>
      
      <div className="pl-2 shrink-0">
        {rightElement ? rightElement : <IconChevronRight />}
      </div>
    </button>
  );
}