import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconBackArrow,
  IconUser,
  IconLock,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
} from "../../components/icons/Icons";
import { API_URL } from "../../config/api";
import DesktopAuthLayout from "../../components/layouts/DesktopAuthLayout";

// ─── Icono Email inline ──────────────────────────────────────────────────────
const IconEmail = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
);

// ─── Input reutilizable ──────────────────────────────────────────────────────
const FormInput = ({
  label,
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  extraProps = {},
  rightElement = null,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-zinc-500 pl-1 uppercase tracking-wider">{label}</label>
    <div className="group bg-zinc-900/60 border border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900 transition-all duration-300 rounded-xl flex items-center pl-4 pr-2 py-3.5 relative">
      <div className="text-zinc-600 group-focus-within:text-white transition-colors duration-300 shrink-0">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        className="bg-transparent border-none text-white w-full ml-3 focus:outline-none placeholder-zinc-600 font-medium text-sm h-full"
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        {...extraProps}
      />
      {rightElement && <div className="ml-2 flex items-center">{rightElement}</div>}
    </div>
  </div>
);

// ─── Algoritmo de fuerza de contraseña ───────────────────────────────────────
const checkPasswordStrength = (pass) => {
  let score = 0;
  if (pass.length > 5) score++;
  if (pass.length > 8) score++;
  if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass) || pass.length > 10) score++;
  return Math.min(score, 4);
};

const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
const strengthLabels = ["", "Débil", "Media", "Media", "Fuerte"];

// ─── Formulario de Registro (compartido) ─────────────────────────────────────
function RegisterForm({ onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    username: "",
    email: "",
    password: "",
  });

  // Debounce username
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.username.length > 2) {
        setIsCheckingUsername(true);
        try {
          const res = await fetch(`${API_URL}/api/auth/check-username/${formData.username}`);
          const data = await res.json();
          setUsernameAvailable(data.available);
        } catch (err) {
          console.error("Error checking username", err);
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameAvailable(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  // Debounce email
  useEffect(() => {
    const timer = setTimeout(async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(formData.email)) {
        setIsCheckingEmail(true);
        try {
          const res = await fetch(`${API_URL}/api/auth/check-email/${formData.email}`);
          const data = await res.json();
          setEmailAvailable(data.available);
        } catch (err) {
          console.error("Error checking email", err);
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setEmailAvailable(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameAvailable === false) {
      setError("El nombre de usuario no está disponible");
      return;
    }
    if (emailAvailable === false) {
      setError("El correo electrónico ya está registrado");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al registrarse");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Validez del indicador de disponibilidad
  const AvailabilityIcon = ({ checking, available }) => {
    if (checking) return <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />;
    if (available === true) return <IconCheck className="w-4 h-4 text-green-500" />;
    if (available === false) return <IconX className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="flex flex-col">
      {/* Back button */}
      <button
        id="register-back-btn"
        onClick={onBack || (() => navigate("/welcome"))}
        className="group mb-6 -ml-1 p-2 w-fit rounded-full hover:bg-white/10 transition-colors duration-200"
        aria-label="Volver"
      >
        <IconBackArrow className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
      </button>

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-2">
          Crear Cuenta
        </h1>
        <p className="text-zinc-400 text-base font-medium">
          Empieza tu transformación hoy.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Nombre Completo */}
        <FormInput
          label="Nombre Completo"
          icon={<IconUser className="w-4 h-4" />}
          type="text"
          name="nombre_completo"
          placeholder="David García"
          value={formData.nombre_completo}
          onChange={handleChange}
        />

        {/* Username */}
        <div>
          <FormInput
            label="Nombre de Usuario"
            icon={<span className="font-black text-sm leading-none">@</span>}
            type="text"
            name="username"
            placeholder="david_g"
            value={formData.username}
            onChange={handleChange}
            extraProps={{ autoComplete: "username" }}
            rightElement={
              <AvailabilityIcon checking={isCheckingUsername} available={usernameAvailable} />
            }
          />
          {usernameAvailable === false && (
            <p className="text-xs text-red-400 mt-1 pl-1">Este nombre de usuario ya está en uso.</p>
          )}
        </div>

        {/* Email */}
        <div>
          <FormInput
            label="Correo Electrónico"
            icon={<IconEmail className="w-4 h-4" />}
            type="email"
            name="email"
            placeholder="hola@oxyra.com"
            value={formData.email}
            onChange={handleChange}
            extraProps={{ autoComplete: "email" }}
            rightElement={
              <AvailabilityIcon checking={isCheckingEmail} available={emailAvailable} />
            }
          />
          {emailAvailable === false && (
            <p className="text-xs text-red-400 mt-1 pl-1">Este correo electrónico ya está registrado.</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 pl-1 uppercase tracking-wider">Contraseña</label>
          <div className="group bg-zinc-900/60 border border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900 transition-all duration-300 rounded-xl flex items-center pl-4 pr-2 py-3.5">
            <div className="text-zinc-600 group-focus-within:text-white transition-colors duration-300 shrink-0">
              <IconLock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              minLength={6}
              className="bg-transparent border-none text-white w-full ml-3 focus:outline-none placeholder-zinc-600 font-medium text-sm"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              id="register-toggle-password"
              type="button"
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
            </button>
          </div>

          {/* Barra de fuerza */}
          {formData.password.length > 0 && (
            <>
              <div className="flex gap-1 h-1 px-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-full rounded-full flex-1 transition-all duration-300 ${
                      passwordStrength >= level ? strengthColors[passwordStrength] : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 px-1 text-right">
                {strengthLabels[passwordStrength]}
              </p>
            </>
          )}
        </div>

        {/* Submit */}
        <button
          id="register-submit-btn"
          type="submit"
          disabled={loading || usernameAvailable === false || emailAvailable === false}
          className="mt-5 w-full bg-white text-black font-bold h-14 rounded-full text-base shadow-[0_0_25px_-8px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            "Crear Cuenta"
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-zinc-500 text-sm font-medium">
        ¿Ya tienes cuenta?{" "}
        <Link
          to="/login"
          className="text-white font-bold hover:underline underline-offset-4 decoration-zinc-500 transition-colors"
        >
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
}

// ─── Página Register ──────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  return (
    <>
      {/* ─── DESKTOP ─── */}
      <DesktopAuthLayout quote="Empieza tu transformación. El camino más difícil es el primero.">
        <RegisterForm />
      </DesktopAuthLayout>

      {/* ─── MOBILE ─── */}
      <div className="md:hidden min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans relative overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-blue-900/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col px-6 py-6 grow">
          <RegisterForm onBack={() => navigate("/welcome")} />
        </div>
      </div>
    </>
  );
}
