import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCheck, IconX, IconLoader, IconHeart } from "../../icons/Icons"; 
import { API_URL } from '../../../config/api';

export default function FollowRequestsSheet({ open, onOpenChange, onUpdate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 

  useEffect(() => {
    if (open) {
        fetchRequests();
    }
  }, [open]);

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch(`${API_URL}/api/users/requests`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setRequests(data);
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
      setActionLoading(userId);
      const token = localStorage.getItem("authToken");
      const endpoint = action === 'accept' ? '/api/users/requests/accept' : '/api/users/requests/reject';
      
      try {
          const res = await fetch(`${API_URL}${endpoint}`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ seguidorId: userId })
          });

          if (res.ok) {
              if (action === 'accept') {
                  setRequests(prev => prev.map(r => 
                      r.idUsuario === userId ? { ...r, estado: 'aceptado' } : r
                  ));
              } else {
                  setRequests(prev => prev.filter(r => r.idUsuario !== userId));
              }
              // Actualizar datos del padre (contador seguidores, etc.)
              if (onUpdate) onUpdate();
          }
      } catch (error) {
          console.error(`Error ${action} request:`, error);
      } finally {
          setActionLoading(null);
      }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85%] rounded-t-[32px] px-5 bg-background border-t border-border overflow-y-auto focus:outline-none">
        
        {/* HEADER */}
        <SheetHeader className="mb-6 mt-6 text-left space-y-1">
            <SheetTitle className="text-2xl font-black italic tracking-tighter">ACTIVIDAD</SheetTitle>
            <SheetDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Solicitudes y notificaciones
            </SheetDescription>
        </SheetHeader>

        {/* LISTA CON SCROLL */}
        <div className="pb-10 min-h-[300px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                    <IconLoader className="animate-spin w-8 h-8 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest font-medium">Cargando actividad...</span>
                </div>
            ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground opacity-40">
                    <IconHeart className="w-16 h-16" />
                    <p className="text-xs font-black uppercase tracking-widest">Sin actividad reciente</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => (
                        <div key={req.idUsuario} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-border/50">
                                    <AvatarImage src={req.foto_perfil} className="object-cover" />
                                    <AvatarFallback>{req.username?.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-base italic tracking-tight">{req.username}</span>
                                    {req.estado === 'pendiente' ? (
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Solicita seguirte</span>
                                    ) : (
                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wide animate-in fade-in slide-in-from-bottom-1 duration-500">Comenzó a seguirte</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {req.estado === 'pendiente' ? (
                                    <>
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="h-9 w-9 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleAction(req.idUsuario, 'reject')}
                                            disabled={actionLoading === req.idUsuario}
                                        >
                                            <IconX className="w-5 h-5" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm transition-all active:scale-95"
                                            onClick={() => handleAction(req.idUsuario, 'accept')}
                                            disabled={actionLoading === req.idUsuario}
                                        >
                                            {actionLoading === req.idUsuario ? <IconLoader className="w-4 h-4 animate-spin" /> : <IconCheck className="w-4 h-4" />}
                                        </Button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </SheetContent>
    </Sheet>
  );
}
