const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use('/usuarios', usuariosRoutes);

app.listen(3001, () => {
    console.log('servidor api en puerto 3001');
});
