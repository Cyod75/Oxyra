import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import logoWhite from "../../assets/images/logo-white.png";

// Usamos imágenes oscuras y de alta calidad para el fondo.
// El texto es más directo, como en la referencia.
const slides = [
  {
    id: 1,
    text: "Registra tus entrenamientos fácilmente, todo desde un mismo lugar.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    text: "Analiza tu progreso y rompe tus marcas personales.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    text: "Únete a la comunidad Oxyra y comparte tus logros.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // 1. Usamos el token de Google para obtener los datos del usuario (email, nombre, etc.)
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await res.json();

      // 2. Enviamos estos datos a NUESTRO backend
      const backendRes = await fetch("http://localhost:3001/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub // Este es el ID único de Google
        }),
      });

      const data = await backendRes.json();

      if (backendRes.ok && data.token) {
        // 3. AHORA SÍ: Guardamos el token que generó nuestro servidor
        localStorage.setItem("authToken", data.token);
        navigate("/");
      } else {
        console.error("Error en el login del servidor:", data.error);
        alert("El servidor no pudo validar la cuenta de Google.");
      }
    } catch (error) {
      console.error("Error en el proceso de Google:", error);
    }
  },
  onError: () => console.log("Error en el login con Google"),
});

  // Autoplay del carrusel (opcional)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Usamos bg-black como base y text-white para todo el contenido
    <div className="h-screen w-full relative bg-black text-white overflow-hidden font-sans">
      {/* --- CAPA DE FONDO (Carrusel de Imágenes) --- */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt="Background"
            className="w-full h-full object-cover opacity-70"
          />
          {/* Overlay degradado para asegurar que el texto blanco y botones se lean bien */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/90" />
        </div>
      ))}

      {/* --- CONTENIDO PRINCIPAL (Capa superior z-10) --- */}
      <div className="relative z-10 h-full flex flex-col px-6 py-12">
        {/* 1. LOGO SUPERIOR */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <img src={logoWhite} alt="Oxyra Logo" className="h-10 w-auto" />
          <h1 className="text-3xl font-bold tracking-widest uppercase">
            OXYRA
          </h1>
        </div>

        {/* 2. CENTRO: TEXTO DEL CARRUSEL Y DOTS */}
        <div className="flex flex-col items-center text-center mt-auto mb-6">
          {/* Texto animado */}
          <h2 className="text-2xl md:text-3xl font-bold leading-tight max-w-md animate-fade-in mx-auto">
            {slides[currentIndex].text}
          </h2>

          {/* Indicadores (Dots) */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. PARTE INFERIOR: BOTONES DE ACCIÓN */}
        <div className="w-full flex flex-col gap-3">
          {/* Botón Google */}
          <button
            onClick={() => loginWithGoogle()}
            className="btn bg-white text-black hover:bg-gray-200 border-none rounded-full w-full h-14 normal-case text-lg font-semibold flex items-center relative shadow-md"
          >
            {/* SVG de Google a color */}
            <svg className="w-6 h-6 absolute left-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="w-full text-center">Regístrate con Google</span>
          </button>

          {/* Botón Email */}
          <button
            onClick={() => navigate("/register")}
            className="btn bg-white text-black hover:bg-gray-200 border-none rounded-full w-full h-14 normal-case text-lg font-semibold flex items-center relative shadow-md"
          >
            {/* Icono Email */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 absolute left-6"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <span className="w-full text-center">Registrarse con Email</span>
          </button>

          {/* Enlace Login inferior */}
          <div className="text-center mt-4 mb-2">
            <span className="text-white/70 font-medium">
              ¿Tienes una cuenta?{" "}
            </span>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 font-bold hover:underline"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
