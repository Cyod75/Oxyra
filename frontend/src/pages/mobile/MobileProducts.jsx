import React from "react";

export default function MobileProducts() {
  return (  
    <div>
      <h1 className="text-2xl font-bold mb-4">Tienda</h1>
      <div className="grid grid-cols-2 gap-3">
        {/* Productos placeholder */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 shadow-md border border-base-200">
            <figure className="bg-base-300 h-24 flex items-center justify-center">
              <span className="opacity-40">IMG</span>
            </figure>
            <div className="card-body p-2">
              <h3 className="text-sm font-bold">Producto {i}</h3>
              <p className="text-primary font-bold text-sm">$19.99</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}