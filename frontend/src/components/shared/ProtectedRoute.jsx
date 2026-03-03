import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }) {
  const token = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // 1. Verificar autenticación básica
  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    return <Navigate to="/welcome" replace />;
  }

  const isAdmin = userData.rol === 'admin' || userData.rol === 'superadmin';

  // 2. Si la ruta es SOLO para admin y el usuario NO es admin -> Redirigir al home (o donde sea)
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Si el usuario ES admin PERO intenta entrar a una ruta de usuario normal (no adminOnly)
  // El requerimiento dice: "no tienen acceso a nada mas fuera de esa interfaz"
  // Así que si un admin intenta entrar al home "/", le redirigimos a "/admin"
  if (!adminOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}