import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconBackArrow,
  IconDumbbell,
  IconCalendar,
  IconTarget,
  IconLoader,
  IconEdit,
  IconSettings,
} from "../../../components/icons/Icons";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { API_URL } from "../../../config/api";
import BackButton from "../../../components/shared/BackButton";

export default function RoutineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para la edición
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    objetivo: "",
    descripcion: "",
  });
  const [saving, setSaving] = useState(false);

  // LÍMITES DE CARACTERES
  const LIMITS = {
    nombre: 40,
    objetivo: 20,
    descripcion: 250,
  };

  useEffect(() => {
    fetchRoutineDetail();
  }, [id]);

  const fetchRoutineDetail = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/users/routine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoutine(data);
        // Inicializar formulario con datos actuales
        setEditForm({
          nombre: data.nombre || "",
          objetivo: data.objetivo || "",
          descripcion: data.descripcion || "",
        });
      }
    } catch (error) {
      console.error("Error al cargar la rutina", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoutine = async () => {
    // Validaciones front-end rápidas
    if (!editForm.nombre.trim()) return alert("El nombre es obligatorio");

    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      // NOTA: La ruta ahora es genérica /routine/:id
      const res = await fetch(`${API_URL}/api/users/routine/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        // Actualizar UI localmente
        setRoutine((prev) => ({ ...prev, ...editForm }));
        setIsEditSheetOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // Helper para manejar cambios en inputs con límite
  const handleChange = (field, value) => {
    if (value.length <= LIMITS[field]) {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <IconLoader className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  if (!routine)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Rutina no encontrada
      </div>
    );

  return (
    <div className="min-h-screen bg-background relative pb-28">
      {/* HEADER VISUAL */}
      <div className="relative h-72 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <IconDumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-primary/5 z-0 rotate-12" />

        {/* NAV BAR */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 pt-6">
          <BackButton 
            className="bg-background/30 backdrop-blur-md rounded-full hover:bg-background/50 border border-white/10 text-white w-10 h-10 p-0 ml-0"
          />

          {/* Botón Editar Principal */}
          <button
            onClick={() => setIsEditSheetOpen(true)}
            className="p-2 bg-background/30 backdrop-blur-md rounded-full hover:bg-background/50 transition-colors border border-white/10 text-white"
          >
            <IconSettings className="w-6 h-6" />
          </button>
        </div>

        {/* DATOS PRINCIPALES */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Badge Nivel */}
            {routine.nivel && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
                {routine.nivel}
              </span>
            )}
            {/* Badge Objetivo (Ahora Editable) */}
            {routine.objetivo && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm flex items-center gap-1.5">
                <IconTarget className="w-3 h-3" />
                {routine.objetivo}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
            {routine.nombre}
          </h1>
        </div>
      </div>

      {/* CONTENIDO SCROLLABLE */}
      <div className="px-5 -mt-2 relative z-20">
        {/* SECCIÓN DESCRIPCIÓN */}
        <div className="mb-8 group">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Descripción del plan
            </h3>
            <button
              onClick={() => setIsEditSheetOpen(true)}
              className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Editar
            </button>
          </div>

          <div className="p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm">
            <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
              {routine.descripcion || (
                <span className="italic text-muted-foreground opacity-70">
                  Sin descripción añadida.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* LISTA DE EJERCICIOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <IconCalendar className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Rutina de hoy</h3>
          </div>

          {routine.ejercicios.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-3xl bg-secondary/5">
              <IconDumbbell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No hay ejercicios configurados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {routine.ejercicios.map((ejercicio, index) => (
                <div
                  key={index}
                  className="bg-card hover:bg-secondary/40 transition-colors p-4 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-muted-foreground shrink-0 border border-border/50">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground text-sm truncate">
                      {ejercicio.nombre}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="text-primary/80 font-semibold bg-primary/5 px-1.5 rounded">
                        {ejercicio.grupo_muscular}
                      </span>
                      <span className="opacity-50">•</span>
                      <span>
                        {ejercicio.series_objetivo} x {ejercicio.reps_objetivo}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/95 to-transparent z-30 pt-10">
        <Button
          className="w-full h-14 text-base font-bold rounded-full shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          onClick={() => navigate(`/workout/session/${id}`)}
          disabled={routine.ejercicios.length === 0}
        >
          Comenzar Entrenamiento
        </Button>
      </div>

      {/* --- SHEET DE EDICIÓN COMPLETA --- */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[32px] px-6 pb-8 bg-background border-t border-border focus:outline-none max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="mb-6 mt-4 text-center">
            <SheetTitle>Editar Detalles</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* INPUT NOMBRE */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Nombre de la Rutina
                </label>
                <span
                  className={`text-xs font-mono ${editForm.nombre.length >= LIMITS.nombre ? "text-red-500" : "text-muted-foreground/50"}`}
                >
                  {editForm.nombre.length}/{LIMITS.nombre}
                </span>
              </div>
              <input
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                value={editForm.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: Push Day A"
              />
            </div>

            {/* INPUT OBJETIVO (Campo Personalizado) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Etiqueta / Objetivo
                </label>
                <span
                  className={`text-xs font-mono ${editForm.objetivo.length >= LIMITS.objetivo ? "text-red-500" : "text-muted-foreground/50"}`}
                >
                  {editForm.objetivo.length}/{LIMITS.objetivo}
                </span>
              </div>
              <input
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                value={editForm.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                placeholder="Ej: Fuerza, Hipertrofia..."
              />
            </div>

            {/* TEXTAREA DESCRIPCIÓN */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Descripción
                </label>
                <span
                  className={`text-xs font-mono ${editForm.descripcion.length >= LIMITS.descripcion ? "text-red-500" : "text-muted-foreground/50"}`}
                >
                  {editForm.descripcion.length}/{LIMITS.descripcion}
                </span>
              </div>
              <textarea
                className="w-full h-32 bg-secondary/30 border border-border rounded-xl p-4 text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                placeholder="Añade notas importantes sobre esta rutina..."
                value={editForm.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              ></textarea>
            </div>

            <Button
              className="w-full h-14 rounded-2xl font-bold text-lg mt-4 shadow-lg"
              onClick={handleUpdateRoutine}
              disabled={saving}
            >
              {saving ? <IconLoader className="animate-spin mr-2" /> : null}
              Guardar Cambios
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
