require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Definición de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
    ██████╗ ██╗  ██╗██╗   ██╗██████╗  █████╗ 
    ██╔══██╗╚██╗██╔╝╚██╗ ██╔╝██╔══██╗██╔══██╗
    ██║  ██║ ╚███╔╝  ╚████╔╝ ██████╔╝███████║
    ██║  ██║ ██╔██╗   ╚██╔╝  ██╔══██╗██╔══██║
    ██████╔╝██╔╝ ██╗   ██║   ██║  ██║██║  ██║
    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
    🚀 Backend corriendo en http://localhost:${PORT}
    `);
});