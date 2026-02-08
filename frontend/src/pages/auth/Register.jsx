import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconBackArrow, IconUser, IconLock } from "../../components/icons/Icons";
import { API_URL } from '../../config/api';

const FormInput = ({ label, icon, type, name, placeholder, value, onChange, extraProps = {} }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 pl-1 uppercase tracking-wider">{label}</label>
        <div className="group bg-zinc-900/50 border border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900 transition-all duration-300 rounded-2xl flex items-center px-4 py-3.5">
            <div className="text-zinc-600 group-focus-within:text-white transition-colors duration-300">
                {icon}
            </div>
            <input 
                type={type} 
                name={name}
                className="bg-transparent border-none text-white w-full ml-3 focus:outline-none placeholder-zinc-600 font-medium h-full"
                placeholder={placeholder}
                required
                value={value}
                onChange={onChange}
                {...extraProps}
            />
        </div>
    </div>
  );

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Ajustado para coincidir con authController.js (nombre_completo, username, email)
  const [formData, setFormData] = useState({
    nombre_completo: "",
    username: "",
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
      // Ruta actualizada a /api/auth/register
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }
      
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Luz ambiental sutil */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col px-6 py-6 h-full grow">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
             onClick={() => navigate("/")} 
             className="group p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <IconBackArrow className="w-6 h-6 text-zinc-300 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Crear Cuenta</h1>
          <p className="text-zinc-400 text-lg font-medium">Empieza tu transformación hoy.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <FormInput 
                label="Nombre Completo"
                icon={<IconUser className="w-5 h-5" />}
                type="text"
                name="nombre_completo"
                placeholder="David García"
                value={formData.nombre_completo}
                onChange={handleChange}
            />

            {/* Nuevo campo Username requerido por el Backend */}
            <FormInput 
                label="Nombre de Usuario"
                icon={<span className="font-bold text-sm">@</span>}
                type="text"
                name="username"
                placeholder="david_g"
                value={formData.username}
                onChange={handleChange}
                extraProps={{ autoComplete: "username" }}
            />

            <FormInput 
                label="Correo Electrónico"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                }
                type="email"
                name="email"
                placeholder="hola@oxyra.com"
                value={formData.email}
                onChange={handleChange}
                extraProps={{ autoComplete: "email" }}
            />

            <FormInput 
                label="Contraseña"
                icon={<IconLock className="w-5 h-5" />}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                extraProps={{ minLength: 6, autoComplete:"new-password" }}
            />

            <button 
                type="submit" 
                disabled={loading}
                className="mt-6 w-full bg-white text-black font-bold h-14 rounded-full text-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : "Crear Cuenta"}
            </button>

        </form>

        <p className="text-center text-zinc-500 font-medium mt-8 mb-4">
            ¿Ya tienes cuenta? {" "}
            <Link to="/login" className="text-white font-bold hover:underline decoration-zinc-500 underline-offset-4">
             Inicia Sesión
            </Link>
        </p>

      </div>
    </div>
  );
}