import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCamera, IconCheckCircle, IconAlertTriangle, IconLoader } from "../../icons/Icons"; 
import { API_URL } from '../../../config/api';

// Recibimos 'userData' para llenar los campos inmediatamente
export default function ProfileSheet({ open, onOpenChange, onUpdate, userData }) {
  const fileInputRef = useRef(null);
  
  // SOLUCIÓN 1: Cooldown de guardado
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [status, setStatus] = useState({ type: null, message: "" });
  
  const [editForm, setEditForm] = useState({ 
      nombre: "", 
      peso: "", 
      altura: "", 
      genero: "M", 
      biografia: "", // SOLUCIÓN 3: Campo nuevo
      file: null 
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);

  // Inicialización de datos desde props (SOLUCIÓN 2: Persistencia)
  useEffect(() => {
    if (open && userData) {
        setEditForm({
            nombre: userData.nombre || "",
            peso: userData.peso || "",
            altura: userData.altura || "",
            genero: userData.genero || "M",
            biografia: userData.biografia || "",
            file: null
        });
        setPreviewUrl(null);
        setStatus({ type: null, message: "" });
    }
  }, [open, userData]);

  const handleSaveChanges = async () => {
    // Evitar spam de clicks
    if (isSubmitting) return;

    setStatus({ type: null, message: "" });
    
    if(!editForm.nombre.trim()) { 
        setStatus({ type: "error", message: "El nombre es obligatorio" }); 
        return; 
    }

    setIsSubmitting(true); // Bloquear botón

    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("nombre_completo", editForm.nombre);
    formData.append("peso_kg", editForm.peso);
    formData.append("estatura_cm", editForm.altura);
    formData.append("genero", editForm.genero);
    formData.append("biografia", editForm.biografia);
    
    if (editForm.file) {
        formData.append("foto", editForm.file);
    }

    try {
        const res = await fetch(`${API_URL}/api/users/update`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData 
        });

        if (res.ok) {
            setStatus({ type: "success", message: "Perfil actualizado con éxito" });
            if (onUpdate) onUpdate(); // Refrescar padre
            
            // Cerrar después de un momento
            setTimeout(() => {
                onOpenChange(false);
                setIsSubmitting(false);
            }, 1000);
        } else { 
            const errorData = await res.json();
            setStatus({ type: "error", message: errorData.error || "Error al actualizar" });
            setIsSubmitting(false);
        }
    } catch (err) { 
        setStatus({ type: "error", message: "Error de conexión" });
        setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) { 
        setEditForm(p => ({...p, file})); 
        setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  // Límite de caracteres para bio
  const BIO_LIMIT = 150;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92%] rounded-t-[32px] px-5 bg-background border-t border-border overflow-y-auto focus:outline-none">
        
        <SheetHeader className="mb-6 mt-4 text-left">
            <SheetTitle>Editar Perfil</SheetTitle>
            <SheetDescription>Actualiza tu información pública y privada.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-10">
            {/* FOTO DE PERFIL */}
            <div className="flex flex-col items-center gap-3">
                <div 
                    className="relative group cursor-pointer" 
                    onClick={() => fileInputRef.current.click()}
                >
                    <Avatar className="h-28 w-28 border-2 border-dashed border-muted shadow-sm">
                        {/* SOLUCIÓN 4: object-cover para evitar imagen escachada */}
                        <AvatarImage 
                            src={previewUrl || userData?.foto_perfil} 
                            className="object-cover w-full h-full aspect-square" 
                        />
                        <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    
                    {/* Overlay de cámara */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconCamera className="text-white w-8 h-8"/>
                    </div>
                    
                    {/* Badge indicador pequeño siempre visible */}
                    <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background">
                         <IconCamera className="w-4 h-4" />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground">Toca para cambiar la foto</p>
            </div>

            {/* FORMULARIO */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Nombre Público</Label>
                    <Input 
                        value={editForm.nombre} 
                        onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} 
                        className="bg-secondary/30"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                         <Label className="text-xs uppercase font-bold text-muted-foreground">Biografía</Label>
                         <span className={`text-[10px] font-mono ${editForm.biografia.length > BIO_LIMIT ? "text-red-500" : "text-muted-foreground"}`}>
                            {editForm.biografia.length}/{BIO_LIMIT}
                         </span>
                    </div>
                    <textarea 
                        value={editForm.biografia} 
                        onChange={(e) => {
                            if(e.target.value.length <= BIO_LIMIT) {
                                setEditForm({...editForm, biografia: e.target.value})
                            }
                        }}
                        placeholder="Cuéntanos un poco sobre ti..."
                        className="w-full h-24 rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Peso (kg)</Label>
                        <Input 
                            type="number" 
                            value={editForm.peso} 
                            onChange={(e) => setEditForm({...editForm, peso: e.target.value})}
                            className="bg-secondary/30" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Altura (cm)</Label>
                        <Input 
                            type="number" 
                            value={editForm.altura} 
                            onChange={(e) => setEditForm({...editForm, altura: e.target.value})} 
                            className="bg-secondary/30"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Género</Label>
                    <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                        value={editForm.genero} 
                        onChange={(e) => setEditForm({...editForm, genero: e.target.value})}
                    >
                        <option value="M" className="bg-background text-foreground">Masculino</option>
                        <option value="F" className="bg-background text-foreground">Femenino</option>
                        <option value="Otro" className="bg-background text-foreground">Otro</option>
                    </select>
                </div>
            </div>
            
            {/* ESTADO Y BOTÓN */}
            {status.message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-bottom-2 ${status.type === 'error' ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'}`}>
                    {status.type === 'error' ? <IconAlertTriangle className="h-4 w-4 shrink-0"/> : <IconCheckCircle className="h-4 w-4 shrink-0"/>} 
                    <span className="font-medium">{status.message}</span>
                </div>
            )}
            
            <Button 
                className="w-full h-12 font-bold text-base shadow-lg mt-2" 
                onClick={handleSaveChanges}
                disabled={isSubmitting} // Deshabilita click múltiple
            >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <IconLoader className="animate-spin w-5 h-5" /> 
                        <span>Guardando...</span>
                    </div>
                ) : "Guardar Cambios"}
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}