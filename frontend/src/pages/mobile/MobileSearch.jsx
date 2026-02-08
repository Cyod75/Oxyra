import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserListItem from "../../components/shared/UserListItem";
import BackButton from "../../components/shared/BackButton"; // Importamos tu componente existente
import { API_URL } from "../../config/api";
import { IconSearch, IconLoader, IconX, IconUser } from "../../components/icons/Icons";

// Hook para debouncing (sin cambios, funciona bien)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MobileSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Referencia para enfocar el input automáticamente

  // Auto-focus al entrar
  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/users/search?query=${debouncedQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
      setQuery("");
      setResults([]);
      inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground animate-in fade-in duration-300">
      
      {/* --- HEADER STICKY TIPO APP NATIVA --- */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 pt-4 pb-3 px-4">
        <div className="flex items-center gap-3">
            {/* Botón Atrás Reutilizado */}
            <BackButton className="shrink-0" />

            {/* Barra de Búsqueda Mejorada */}
            <div className="relative flex-1 group">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 h-4 w-4 transition-colors group-focus-within:text-primary" />
                
                <Input 
                    ref={inputRef}
                    placeholder="Buscar atletas..." 
                    className="pl-10 pr-10 h-11 rounded-2xl bg-secondary/50 border-transparent focus-visible:bg-secondary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all text-base shadow-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Botón 'X' para limpiar */}
                {query.length > 0 && (
                    <button 
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-foreground/10 text-muted-foreground hover:bg-foreground/20 active:scale-95 transition-all"
                    >
                        <IconX className="h-3 w-3" />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      <ScrollArea className="flex-1 w-full">
        <div className="px-4 py-4 min-h-[calc(100vh-80px)]">
            
            {/* ESTADO: CARGANDO */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-70">
                    <IconLoader className="animate-spin text-primary h-8 w-8" />
                    <p className="text-xs font-medium text-muted-foreground animate-pulse">Buscando perfiles...</p>
                </div>
            )}

            {/* ESTADO: SIN BÚSQUEDA (INICIAL) */}
            {!loading && query.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 select-none">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4 border border-border">
                        <IconSearch className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">Descubre la comunidad</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                        Busca amigos, competidores o inspiración.
                    </p>
                </div>
            )}

            {/* ESTADO: SIN RESULTADOS */}
            {!loading && results.length === 0 && query.length > 1 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-60">
                    <IconUser className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No encontramos a "{query}"</p>
                    <p className="text-xs text-muted-foreground">Prueba con otro nombre de usuario.</p>
                </div>
            )}

            {/* LISTA DE RESULTADOS */}
            <div className="space-y-3">
                {results.length > 0 && (
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 pl-1">
                        Resultados
                    </p>
                )}
                {results.map((user) => (
                    <div key={user.idUsuario} className="animate-in slide-in-from-bottom-2 duration-300">
                        <UserListItem user={user} />
                    </div>
                ))}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}