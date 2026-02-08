import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

export default function UserListItem({ user }) {
  const navigate = useNavigate();
  // Estado local para la UI instantánea (Optimistic UI)
  const [isFollowing, setIsFollowing] = useState(user.lo_sigo);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);

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
        body: JSON.stringify({ [bodyKey]: user.idUsuario }),
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error social:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/profile/${user.username}`)}
      className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-xl mb-2 cursor-pointer hover:bg-card transition-colors active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
          <AvatarImage 
            src={user.foto_perfil} 
            className="object-cover w-full h-full aspect-square"
          />
          <AvatarFallback className="font-bold text-xs bg-secondary text-muted-foreground">
            {user.username ? user.username.substring(0,2).toUpperCase() : "??"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-none text-foreground">{user.username}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{user.nombre_completo}</p>
        </div>
      </div>

      <Button 
        size="sm" 
        variant={isFollowing ? "outline" : "default"}
        className={`h-8 px-4 text-xs font-bold transition-all shadow-sm ${
            isFollowing 
            ? "text-muted-foreground border-border bg-transparent hover:bg-secondary/50" 
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
        onClick={handleFollowToggle}
        disabled={loading}
      >
        {loading ? "..." : (isFollowing ? "Siguiendo" : "Seguir")}
      </Button>
    </div>
  );
}