import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/api';
// ICONOS
import { IconSettings, IconUserPlus } from "../../components/icons/Icons";

// SHADCN UI
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// COMPONENTE REUTILIZABLE
import ProfileSheet from "../../components/settings/sheets/ProfileSheet";
// IMPORTAR EL LOADER
import ModernLoader from "../../components/shared/ModernLoader";

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function MobileProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Estado para controlar el Popup de edición
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Estado del usuario
  const [user, setUser] = useState({
    nombre: "Cargando...",
    username: "...",
    biografia: "",
    foto_perfil: DEFAULT_AVATAR,
    peso: "",
    altura: "",
    genero: "M",
    stats: { entrenos: 0, seguidores: 0, seguidos: 0 },
    es_pro: false 
  });

  // 1. CARGAR DATOS
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/welcome");

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Error al cargar perfil");
      
      const data = await response.json();

      setUser({
          nombre: data.nombre_completo || "Usuario",
          username: data.username,
          biografia: data.biografia || "",
          foto_perfil: data.foto_perfil || DEFAULT_AVATAR,
          
          // IMPORTANTE: Mapeo exacto con los nombres que devolvemos ahora en el backend
          peso: data.peso_kg || "",
          altura: data.estatura_cm || "",
          genero: data.genero || "M",
          
          stats: { 
              entrenos: data.stats?.entrenos || 0, 
              seguidores: data.stats?.seguidores || 0, 
              seguidos: data.stats?.seguidos || 0 
          },
          es_pro: data.es_pro === 1
      });

      setLoading(false);

    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const handleShareProfile = async () => {
    const shareUrl = `${window.location.origin}/profile/${user.username}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Perfil de ${user.nombre}`,
                text: '¡Entrena conmigo en Oxyra!',
                url: shareUrl
            });
            return; 
        } catch (err) {
            console.log("Compartir cancelado");
        }
    }

    try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Enlace copiado al portapapeles"); 
    } catch (err) {
        alert("No se pudo copiar el enlace automáticamente");
    }
  };

  // 4. BLOQUEO DE SEGURIDAD (SOLUCIÓN LOADER)
  if (loading || error) {
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden pt-[108px]">
            <ModernLoader text={error ? "ERROR DE CONEXIÓN" : "PREPARANDO PERFIL..."} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-foreground animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
         <h1 className="text-xl font-bold tracking-tight">@{user.username}</h1>
         <div className="flex items-center gap-5">
            <IconUserPlus className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
            <div onClick={() => navigate("/settings")} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                <IconSettings />
            </div>
         </div>
      </div>

      {/* INFO PERFIL */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex items-center gap-6">
           <Avatar className="h-24 w-24 border border-border shadow-sm">
              <AvatarImage src={user.foto_perfil} className="object-cover" />
              <AvatarFallback>OX</AvatarFallback>
           </Avatar>

           <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col">
                 <span className="font-bold text-lg leading-none">{user.nombre}</span>
                 {user.es_pro && (
                    <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest mt-1">
                        Pro Athlete
                    </span>
                 )}
              </div>

              <div className="flex justify-between pr-4">
                 <StatItem label="Entrenos" num={user.stats.entrenos} />
                 <StatItem label="Seguidores" num={user.stats.seguidores} />
                 <StatItem label="Seguidos" num={user.stats.seguidos} />
              </div>
           </div>
        </div>

        <div className="mt-4">
           <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
             {user.biografia || "Añade una descripción sobre ti."}
           </p>
        </div>
      </div>

      {/* BOTONES ACCIÓN */}
      <div className="px-4 mb-8">
        <div className="flex gap-3">
           <Button 
             variant="outline" 
             onClick={() => setIsSheetOpen(true)}
             className="flex-1 h-9 rounded-lg font-semibold bg-secondary/50 border-0 text-foreground hover:bg-secondary transition-colors"
           >
             Editar Perfil
           </Button>
           
           <Button 
             variant="outline" 
             onClick={handleShareProfile}
             className="flex-1 h-9 rounded-lg font-semibold bg-secondary/50 border-0 text-foreground hover:bg-secondary transition-colors"
           >
              Compartir
           </Button>
        </div>
      </div>

      {/* GRÁFICA */}
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
                      className={`w-full rounded-t-sm transition-all ${val > 0 ? 'bg-primary hover:bg-primary/80' : 'bg-secondary'}`} 
                      style={{ height: `${val || 5}%`, opacity: val > 0 ? 1 : 0.3 }} 
                    />
                 </div>
              ))}
           </CardContent>
        </Card>
      </div>

      {/* POPUP DE EDICIÓN */}
      <ProfileSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onUpdate={fetchProfile}
        userData={user} 
      />

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