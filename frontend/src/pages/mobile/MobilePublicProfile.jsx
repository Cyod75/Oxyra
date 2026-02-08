import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconLoader, IconCheck } from "../../components/icons/Icons";
import BackButton from "../../components/shared/BackButton";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function MobilePublicProfile() {
  const { username } = useParams(); // Cogemos el username de la URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/users/profile/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 404) {
          alert("Usuario no encontrado");
          navigate(-1);
        }
        return;
      }

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;
    setFollowLoading(true);

    const isFollowing = profile.lo_sigo;
    const endpoint = isFollowing ? "/api/users/unfollow" : "/api/users/follow";
    const bodyKey = isFollowing ? "idUsuarioADejar" : "idUsuarioASequir";

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [bodyKey]: profile.idUsuario }),
      });

      if (res.ok) {
        // Actualización Optimista de la UI
        setProfile((prev) => ({
          ...prev,
          lo_sigo: !isFollowing,
          stats: {
            ...prev.stats,
            seguidores: isFollowing
              ? prev.stats.seguidores - 1
              : prev.stats.seguidores + 1,
          },
        }));
      }
    } catch (error) {
      console.error("Error al seguir", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <IconLoader className="animate-spin text-primary" />
      </div>
    );
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-foreground animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* HEADER STICKY CON BACK BUTTON */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-4 h-14 flex items-center gap-2">
        <BackButton />
        <h1 className="text-lg font-bold tracking-tight">
          @{profile.username}
        </h1>
      </div>

      {/* INFO PERFIL */}
      <div className="px-4 mt-6 mb-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-background ring-2 ring-border/50 shadow-xl">
            <AvatarImage
              src={profile.foto_perfil || DEFAULT_AVATAR}
              className="object-cover"
            />
            <AvatarFallback>
              {profile.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between pr-2">
              <StatItem num={profile.stats.entrenos} label="Entrenos" />
              <StatItem num={profile.stats.seguidores} label="Seguidores" />
              <StatItem num={profile.stats.seguidos} label="Seguidos" />
            </div>

            {/* BOTÓN SEGUIR */}
            <Button
              size="sm"
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`w-full font-bold transition-all shadow-sm ${
                profile.lo_sigo
                  ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {followLoading ? (
                <IconLoader className="animate-spin h-4 w-4" />
              ) : profile.lo_sigo ? (
                "Siguiendo"
              ) : (
                "Seguir"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <h2 className="font-bold text-lg leading-none">
            {profile.nombre_completo}
          </h2>
          {profile.rango_global !== "Sin Rango" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 inline-block mb-1">
              {profile.rango_global}
            </span>
          )}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {profile.biografia || "Sin biografía."}
          </p>
        </div>
      </div>

      {/* SECCIÓN DE DATOS VISUALES (Placeholder para mantener estilo) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Actividad Reciente
          </h3>
        </div>
        <Card className="bg-card/30 border-border/40 shadow-none">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-2 opacity-50">
            <span className="text-4xl">🔒</span>
            <p className="text-sm font-medium">La actividad es privada</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatItem({ num, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-foreground leading-none">
        {num}
      </span>
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mt-1">
        {label}
      </span>
    </div>
  );
}
