import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconLoader, IconPlus, IconTrash, IconDumbbell } from "../../icons/Icons";
import ExerciseSelectorSheet from "./ExerciseSelectorSheet";
import { API_URL } from "../../../config/api";

export default function CreateManualRoutineSheet({ open, onOpenChange, onRoutineCreated }) {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([]); // Lista de ejercicios añadidos
  const [loading, setLoading] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return alert("Ponle un nombre a la rutina");
    if (exercises.length === 0) return alert("Añade al menos un ejercicio");

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/users/routine/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: name,
            objetivo: "Personalizado",
            ejercicios: exercises
        })
      });

      const data = await res.json();
      if (res.ok) {
        onRoutineCreated(data.rutina);
        // Reset y cerrar
        setName("");
        setExercises([]);
        onOpenChange(false);
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const removeExercise = (indexToRemove) => {
      setExercises(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95%] rounded-t-[32px] bg-background border-t border-border px-0 flex flex-col focus:outline-none">
        
        <SheetHeader className="px-6 mt-6 mb-2 text-left">
          <SheetTitle className="text-2xl font-bold">Nueva Rutina</SheetTitle>
        </SheetHeader>

        <div className="px-6 mb-6">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Nombre</label>
            <input 
                type="text" 
                placeholder="Ej: Pierna Frecuencia 2..."
                className="w-full bg-transparent border-b-2 border-border/50 py-2 text-xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>

        {/* Lista de ejercicios seleccionados */}
        <div className="flex-1 overflow-y-auto px-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-foreground">Ejercicios ({exercises.length})</h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-3 rounded-full text-xs font-bold"
                    onClick={() => setIsSelectorOpen(true)}
                >
                    + Añadir
                </Button>
            </div>

            {exercises.length === 0 ? (
                <div 
                    onClick={() => setIsSelectorOpen(true)}
                    className="border-2 border-dashed border-border/50 rounded-2xl h-32 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors gap-2"
                >
                    <IconDumbbell className="w-8 h-8 opacity-50" />
                    <span className="text-sm font-medium">Toca para añadir ejercicios</span>
                </div>
            ) : (
                <div className="space-y-3 pb-20">
                    {exercises.map((ex, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-card border border-border/40 p-4 rounded-xl shadow-sm">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-xs font-bold shrink-0">
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-foreground">{ex.nombre}</h4>
                                <span className="text-xs text-muted-foreground">{ex.grupo_muscular}</span>
                            </div>
                            <button onClick={() => removeExercise(idx)} className="text-muted-foreground/40 hover:text-red-500 transition-colors">
                                <IconTrash className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    
                    {/* Botón extra abajo para seguir añadiendo */}
                    <Button 
                        variant="outline"
                        className="w-full border-dashed border-border/50 text-muted-foreground"
                        onClick={() => setIsSelectorOpen(true)}
                    >
                        Añadir más ejercicios
                    </Button>
                </div>
            )}
        </div>

        {/* Footer Guardar */}
        <div className="p-6 border-t border-border/30 bg-background/95 backdrop-blur-sm">
            <Button 
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? <IconLoader className="animate-spin" /> : "Guardar Rutina"}
            </Button>
        </div>

        {/* Selector anidado */}
        <ExerciseSelectorSheet 
            open={isSelectorOpen} 
            onOpenChange={setIsSelectorOpen}
            onExercisesSelected={(newExercises) => setExercises(prev => [...prev, ...newExercises])}
        />

      </SheetContent>
    </Sheet>
  );
}   