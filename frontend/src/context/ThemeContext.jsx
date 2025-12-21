import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      // Si hay tema guardado, úsalo
      if (savedTheme) return savedTheme;
      
      // Si no, detecta preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "sunset";
      }
      return "nord"; // Tema claro por defecto
    } catch {
      return "nord";
    }
  });

  useEffect(() => {
    // Aplica el tema al tag <html>
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "nord" ? "sunset" : "nord"));
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "sunset",
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}