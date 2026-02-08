import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCrown, IconCheckCircle, IconCreditCard, IconAlertTriangle } from "../../icons/Icons"; 

export default function SubscriptionSheet({ open, onOpenChange, isPro, daysLeft, loading, onSubscribe, onCancel }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [payForm, setPayForm] = useState({ card: "", expiry: "", cvc: "" });
  const [payErrors, setPayErrors] = useState({});

  // Resetear estados al cerrar/abrir
  React.useEffect(() => { if(!open) setShowCancelConfirm(false); }, [open]);

  const handlePaySubmit = () => {
    let errors = {};
    // Validaciones
    if (!payForm.card || payForm.card.length !== 16) errors.card = "16 dígitos requeridos";
    if (!payForm.expiry || payForm.expiry.length < 4) errors.expiry = "Requerido";
    if (!payForm.cvc || payForm.cvc.length !== 3) errors.cvc = "3 dígitos";
    
    setPayErrors(errors);

    if (Object.keys(errors).length === 0) {
        onSubscribe(payForm, () => {
            onOpenChange(false);
            setPayForm({ card: "", expiry: "", cvc: "" });
            setPayErrors({}); // Limpiar errores
        });
    }
  };

  const handleConfirmCancel = () => {
      onCancel(() => {
          setShowCancelConfirm(false);
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto rounded-t-3xl px-6 pb-8">
        <SheetHeader className="mb-6 mt-4 text-center">
            <SheetTitle className="text-xl">
                {showCancelConfirm ? "Confirmar Cancelación" : (isPro ? "Tu Membresía Pro" : "Oxyra Pro")}
            </SheetTitle>
            <SheetDescription>
                {showCancelConfirm 
                    ? "Esta acción es irreversible." 
                    : (isPro ? "Tu cuenta está al máximo nivel." : "Desbloquea todo el potencial de tu entrenamiento.")
                }
            </SheetDescription>
        </SheetHeader>

        {isPro ? (
            showCancelConfirm ? (
                // --- VISTA: CONFIRMAR CANCELACIÓN ---
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6 bg-red-500/10 rounded-2xl flex flex-col items-center text-center space-y-3">
                         <IconAlertTriangle className="h-8 w-8 text-red-500" />
                         <p className="text-sm font-medium text-red-500">Perderás tus beneficios inmediatamente.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button variant="destructive" className="w-full" onClick={handleConfirmCancel} disabled={loading}>{loading ? "..." : "Sí, cancelar"}</Button>
                        <Button variant="outline" className="w-full" onClick={() => setShowCancelConfirm(false)}>Volver</Button>
                    </div>
                </div>
            ) : (
                // --- VISTA: TARJETA PRO ACTIVA ---
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <IconCrown className="w-32 h-32 rotate-12 aspect-square" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mt-1">PRO</h2>
                            <p className="font-mono mt-4">Quedan {daysLeft} días</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={() => setShowCancelConfirm(true)}>Cancelar Suscripción</Button>
                </div>
            )
        ) : (
            // --- VISTA: FORMULARIO DE PAGO ---
            <div className="space-y-6">
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 space-y-3">
                    <div className="flex items-center gap-3"><IconCheckCircle className="w-4 h-4 text-blue-500"/><span className="text-sm">IA Generativa ilimitada</span></div>
                    <div className="flex items-center gap-3"><IconCheckCircle className="w-4 h-4 text-blue-500"/><span className="text-sm">Sin anuncios</span></div>
                </div>
                
                <div className="space-y-3">
                    {/* Eliminado "(Simulado)" */}
                    <Label>Tarjeta de Crédito</Label>
                    
                    {/* Input Tarjeta con Errores */}
                    <div className="space-y-1">
                        <div className="relative">
                            <IconCreditCard className={`absolute left-3 top-2.5 h-4 w-4 ${payErrors.card ? "text-red-500" : "text-muted-foreground"}`}/>
                            <Input 
                                className={`pl-9 font-mono transition-colors ${payErrors.card ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                                placeholder="0000 0000 0000 0000" 
                                maxLength={16} 
                                value={payForm.card} 
                                onChange={e => setPayForm({...payForm, card: e.target.value})} 
                            />
                        </div>
                        {payErrors.card && <p className="text-[11px] text-red-500 font-medium ml-1 slide-in-from-top-1 animate-in fade-in">{payErrors.card}</p>}
                    </div>
                    
                    <div className="flex gap-2">
                        {/* Input Expiración con Errores */}
                        <div className="w-1/2 space-y-1">
                            <Input 
                                className={`font-mono transition-colors ${payErrors.expiry ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                                placeholder="MM/YY" 
                                maxLength={5} 
                                value={payForm.expiry} 
                                onChange={e => setPayForm({...payForm, expiry: e.target.value})} 
                            />
                            {payErrors.expiry && <p className="text-[11px] text-red-500 font-medium ml-1 slide-in-from-top-1 animate-in fade-in">{payErrors.expiry}</p>}
                        </div>

                        {/* Input CVC con Errores */}
                        <div className="w-1/2 space-y-1">
                            <Input 
                                className={`font-mono transition-colors ${payErrors.cvc ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                                placeholder="CVC" 
                                maxLength={3} 
                                value={payForm.cvc} 
                                onChange={e => setPayForm({...payForm, cvc: e.target.value})} 
                            />
                            {payErrors.cvc && <p className="text-[11px] text-red-500 font-medium ml-1 slide-in-from-top-1 animate-in fade-in">{payErrors.cvc}</p>}
                        </div>
                    </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold" onClick={handlePaySubmit} disabled={loading}>
                    {loading ? "Procesando..." : "Pagar 9.99€"}
                </Button>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}