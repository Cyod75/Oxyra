import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("authToken");

  // Si no hay token, o es una cadena de texto errónea como "undefined" o "null"
  if (!token || token === "undefined" || token === "null") {
    // Limpiamos por si acaso había basura
    localStorage.removeItem("authToken");
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}