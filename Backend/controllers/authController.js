const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nombre_completo, username, email, password } = req.body;
    try {
        const [exists] = await db.query("SELECT idUsuario FROM usuarios WHERE email = ? OR username = ?", [email, username]);
        if (exists.length > 0) return res.status(400).json({ error: "Email o Username ya registrados" });

        const hash = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO usuarios (nombre_completo, username, email, password_hash) VALUES (?, ?, ?, ?)",
            [nombre_completo, username, email, hash]
        );
        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (users.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.idUsuario, username: user.username, es_pro: user.es_pro },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user: { id: user.idUsuario, username: user.username, nombre: user.nombre_completo, foto: user.foto_perfil, rango: user.rango_global } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Añadir esto a authController.js
exports.googleLogin = async (req, res) => {
    const { email, name, sub, picture } = req.body;
    try {
        // 1. Buscar si el usuario ya existe por email
        let [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        let user;

        if (users.length === 0) {
            // 2. Si no existe, lo creamos (Registro automático)
            // Usamos el 'sub' de google como una clave o generamos un username
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            const [result] = await db.query(
                "INSERT INTO usuarios (nombre_completo, username, email, foto_perfil) VALUES (?, ?, ?, ?)",
                [name, username, email, picture]
            );
            
            const [newUser] = await db.query("SELECT * FROM usuarios WHERE idUsuario = ?", [result.insertId]);
            user = newUser[0];
        } else {
            user = users[0];
        }

        // 3. Generar el Token (IMPORTANTE: Mismo formato que el login normal)
        const token = jwt.sign(
            { id: user.idUsuario, username: user.username, es_pro: user.es_pro },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en Google Login" });
    }
};