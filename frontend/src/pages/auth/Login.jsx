import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconBackArrow, IconLock } from "../../components/icons/Icons";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Ajustado: backend espera 'email', no 'correo'
  const [formData, setFormData] = useState({
    email: "", 
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ruta actualizada a /api/auth/login
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Guardamos token. El backend ahora devuelve { token, user: {...} }
      // Podrías guardar data.user en un contexto global si quisieras.
      localStorage.setItem("authToken", data.token);
      navigate("/"); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden selection:bg-white selection:text-black">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col px-6 py-6 h-full grow">
        
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate("/")} 
            className="group p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <IconBackArrow className="w-6 h-6 text-zinc-300 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
            Bienvenido a Oxyra
          </h1>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed">
            Tus entrenamientos te esperan.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 pl-1 uppercase tracking-wider">Correo</label>
            <div className="group bg-zinc-900/50 border border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900 transition-all duration-300 rounded-2xl flex items-center px-4 py-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-zinc-600 group-focus-within:text-white transition-colors duration-300"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input 
                type="email" 
                name="email" // Cambiado name="correo" a name="email"
                className="bg-transparent border-none text-white w-full ml-3 focus:outline-none placeholder-zinc-600 font-medium h-full"
                placeholder="ejemplo@oxyra.com" 
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Contraseña</label>
            </div>
            
            <div className="group bg-zinc-900/50 border border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900 transition-all duration-300 rounded-2xl flex items-center px-4 py-3.5">
              <IconLock className="w-5 h-5 text-zinc-600 group-focus-within:text-white transition-colors duration-300" />
              <input 
                type="password" 
                name="password"
                className="bg-transparent border-none text-white w-full ml-3 focus:outline-none placeholder-zinc-600 font-medium h-full"
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
             <div className="flex justify-end pt-1">
                <a href="#" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-white text-black font-bold h-14 rounded-full text-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
               <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : "Iniciar Sesión"}
          </button>

        </form>

        <div className="mt-auto mb-4 text-center">
          <p className="text-zinc-500 font-medium">
            ¿No tienes cuenta? {" "}
            <Link to="/register" className="text-white font-bold hover:underline decoration-zinc-500 underline-offset-4">
              Regístrate
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}