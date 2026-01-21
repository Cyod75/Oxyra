import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// IMPORTAMOS TUS ICONOS LOCALES (Asegúrate de haber añadido IconCamera y IconUserPlus en Icons.jsx)
import { IconSettings, IconUserPlus, IconCamera } from "../../components/icons/Icons";

// SHADCN UI
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function MobileProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  const [loading, setLoading] = useState(true);

  // Estado principal del usuario
  const [user, setUser] = useState({
    nombre: "Cargando...",
    username: "...",
    biografia: "",
    foto_perfil: DEFAULT_AVATAR,
    stats: { entrenos: 0, seguidores: 0, seguidos: 0 },
    es_pro: false 
  });

  // Estado temporal solo para el formulario de edición
  const [editForm, setEditForm] = useState({
    nombre: "",
    biografia: "",
    file: null 
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);

  // 1. CARGAR DATOS
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/welcome");

      try {
        const response = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error al cargar perfil");
        
        const data = await response.json();

        setUser({
            nombre: data.nombre_completo || "Usuario Oxyra",
            username: data.username,
            biografia: data.biografia || "",
            foto_perfil: data.foto_perfil || DEFAULT_AVATAR, 
            stats: { 
                entrenos: data.stats?.length || 0, 
                seguidores: 0, 
                seguidos: 0 
            },
            es_pro: data.es_pro === 1
        });

        // Inicializamos el form
        setEditForm({
            nombre: data.nombre_completo || "",
            biografia: data.biografia || "",
            file: null
        });

      } catch (error) {
        console.error("Error profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 2. PREVIEW FOTO (Solo ocurre dentro del modal)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setEditForm(prev => ({ ...prev, file: file }));
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. GUARDAR (Solo aquí se hacen cambios persistentes)
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    formData.append("nombre_completo", editForm.nombre);
    formData.append("biografia", editForm.biografia);
    
    if (editForm.file) {
        formData.append("foto", editForm.file); 
    }

    try {
        const res = await fetch("http://localhost:3001/api/users/update", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData 
        });

        if (res.ok) {
            const data = await res.json();
            // Actualizamos la vista principal solo si el backend confirma éxito
            setUser(prev => ({
                ...prev,
                nombre: editForm.nombre,
                biografia: editForm.biografia,
                foto_perfil: data.foto_perfil || prev.foto_perfil 
            }));
            // Limpiamos preview
            setPreviewUrl(null);
            alert("Perfil actualizado correctamente");
            // Nota: El Sheet se cerrará automáticamente si usas el componente standard o puedes controlar el estado open
        }
    } catch (err) {
        console.error("Error updating:", err);
        alert("Error al actualizar perfil");
    }
  };

  // Resetear el formulario al abrir (opcional, para descartar cambios no guardados previos)
  const handleOpenSheet = () => {
      setEditForm({
          nombre: user.nombre,
          biografia: user.biografia,
          file: null
      });
      setPreviewUrl(null);
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      
      {/* 1. TOP BAR (NO STICKY) - Se integra en el flujo normal */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 bg-background">
         <h1 className="text-xl font-bold tracking-tight text-foreground">{user.username}</h1>
         <div className="flex items-center gap-5">
            <IconUserPlus className="text-foreground" />
            {/* Reutilizamos tu IconSettings existente */}
            <div onClick={() => navigate("/settings")} className="cursor-pointer">
                <IconSettings />
            </div>
         </div>
      </div>

      {/* 2. SECCIÓN INFO PERFIL */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex items-center gap-6">
           
           {/* AVATAR (Izquierda) - SIN ONCLICK (Solo visual) */}
           <Avatar className="h-24 w-24 border border-border shadow-sm">
              <AvatarImage src={user.foto_perfil} className="object-cover" />
              <AvatarFallback>OX</AvatarFallback>
           </Avatar>

           {/* INFO (Derecha) */}
           <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-lg leading-none text-foreground">{user.nombre}</span>
              </div>

              {/* Stats: Etiqueta arriba, Número abajo */}
              <div className="flex justify-between pr-4">
                 <StatItem label="Entrenos" num={user.stats.entrenos} />
                 <StatItem label="Seguidores" num={user.stats.seguidores} />
                 <StatItem label="Seguidos" num={user.stats.seguidos} />
              </div>
           </div>
        </div>

        {/* BIOGRAFÍA */}
        <div className="mt-4">
           <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
             {user.biografia || "Sin biografía."}
           </p>
        </div>
      </div>

      {/* 3. BOTONES DE ACCIÓN */}
      <div className="px-4 mb-8">
        <div className="flex gap-3">
           {/* SHEET PARA EDITAR */}
           <Sheet onOpenChange={(open) => open && handleOpenSheet()}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 h-9 rounded-lg font-semibold bg-secondary/50 border-0 text-foreground hover:bg-secondary">
                  Editar Perfil
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90%] rounded-t-2xl px-5">
                 <SheetHeader className="mb-6 mt-4">
                    <SheetTitle>Editar Perfil</SheetTitle>
                    <SheetDescription>Actualiza tu información pública.</SheetDescription>
                 </SheetHeader>
                 
                 <div className="space-y-6">
                    {/* ZONA DE EDICIÓN DE FOTO (Solo aquí se puede cambiar) */}
                    <div className="flex flex-col items-center gap-3">
                        <div 
                            className="relative group cursor-pointer" 
                            onClick={() => fileInputRef.current.click()}
                        >
                            <Avatar className="h-24 w-24 border-2 border-dashed border-muted group-hover:border-primary transition-colors">
                               {/* Mostramos preview si existe, sino la actual */}
                               <AvatarImage src={previewUrl || user.foto_perfil} className="object-cover" />
                               <AvatarFallback>IMG</AvatarFallback>
                            </Avatar>
                            {/* Overlay icon */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <IconCamera className="text-white" />
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Toca para cambiar la foto</span>
                        
                        {/* Input oculto */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    <div className="space-y-1">
                       <Label>Nombre</Label>
                       <Input value={editForm.nombre} onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <Label>Biografía</Label>
                       <Textarea value={editForm.biografia} onChange={(e) => setEditForm({...editForm, biografia: e.target.value})} />
                    </div>
                    <Button className="w-full" onClick={handleSaveChanges}>Guardar Cambios</Button>
                 </div>
              </SheetContent>
           </Sheet>
           
           <Button variant="outline" className="flex-1 h-9 rounded-lg font-semibold bg-secondary/50 border-0 text-foreground hover:bg-secondary">
              Compartir
           </Button>
        </div>
      </div>

      {/* 4. GRÁFICA DE CONSISTENCIA */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consistencia</h3>
            <span className="text-xs text-muted-foreground">Últimos 7 días</span>
        </div>
        <Card className="bg-card/40 border-border/40 shadow-none">
           <CardContent className="p-4 flex items-end justify-between h-32 gap-1">
              {[20, 45, 30, 80, 55, 90, 40].map((val, i) => (
                 <div key={i} className="w-full relative group">
                    <div 
                      className="w-full bg-primary rounded-t-sm transition-all hover:bg-primary/80" 
                      style={{ height: `${val}%`, opacity: val > 0 ? 1 : 0.1 }} 
                    />
                 </div>
              ))}
           </CardContent>
        </Card>
      </div>

    </div>
  );
}

function StatItem({ num, label }) {
  return (
    <div className="flex flex-col items-start min-w-[60px]">
       <span className="text-[11px] text-muted-foreground font-medium mb-0.5">{label}</span>
       <span className="text-lg font-bold text-foreground leading-none">{num}</span>
    </div>
  );
}