import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// IMPORTANTE: Importamos el contexto para que funcione el cambio de tema en toda la app
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* El Provider debe estar dentro del Router o envolviéndolo, 
          pero siempre envolviendo a App para que useTheme funcione dentro. */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)