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
        // PERMITIR LOGIN CON EMAIL O USERNAME
        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ? OR username = ?", [email, email]);
        if (users.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.idUsuario, username: user.username, es_pro: user.es_pro, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user: { id: user.idUsuario, username: user.username, nombre: user.nombre_completo, foto: user.foto_perfil, rango: user.rango_global, rol: user.rol } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const [users] = await db.query("SELECT idUsuario FROM usuarios WHERE username = ?", [username]);
        if (users.length > 0) {
            return res.json({ available: false });
        }
        res.json({ available: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const [users] = await db.query("SELECT idUsuario FROM usuarios WHERE email = ?", [email]);
        if (users.length > 0) {
            return res.json({ available: false });
        }
        res.json({ available: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- PASSWORD RESET ---

const notifController = require('./notificationController');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query("SELECT idUsuario, nombre_completo FROM usuarios WHERE email = ?", [email]);
        if (users.length === 0) return res.status(404).json({ error: "Este correo no está registrado en Oxyra." });
        
        const user = users[0];
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await db.query("UPDATE usuarios SET reset_code = ?, reset_expires = ? WHERE idUsuario = ?", [code, expires, user.idUsuario]);

        await notifController.sendEmailNotification(
            email,
            "Código de Recuperación de Cuenta 🔐",
            `Hola <b>${user.nombre_completo}</b>,<br><br>
            Hemos recibido una solicitud para restablecer tu contraseña.<br>
            Tu código de verificación es:<br><br>
            <b style="font-size: 24px; letter-spacing: 4px; color: #ffffff;">${code}</b><br><br>
            Este código expirará en 15 minutos.`
        );

        res.json({ message: "Código enviado a tu correo" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar solicitud" });
    }
};

exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;
    try {
        const [users] = await db.query("SELECT idUsuario, reset_expires FROM usuarios WHERE email = ? AND reset_code = ?", [email, code]);
        
        if (users.length === 0) return res.status(400).json({ error: "Código inválido" });
        
        if (new Date() > new Date(users[0].reset_expires)) {
            return res.status(400).json({ error: "El código ha expirado" });
        }

        res.json({ message: "Código verificado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const [users] = await db.query("SELECT idUsuario, reset_expires FROM usuarios WHERE email = ? AND reset_code = ?", [email, code]);
        
        if (users.length === 0) return res.status(400).json({ error: "Solicitud inválida" });
        if (new Date() > new Date(users[0].reset_expires)) return res.status(400).json({ error: "El código ha expirado" });

        const hash = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE usuarios SET password_hash = ?, reset_code = NULL, reset_expires = NULL WHERE idUsuario = ?", [hash, users[0].idUsuario]);

        res.json({ message: "Contraseña restablecida correctamente" });
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
            { id: user.idUsuario, username: user.username, es_pro: user.es_pro, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en Google Login" });
    }
};

exports.sendDeletionCode = async (req, res) => {
    const idUsuario = req.user.id;
    try {
        const [users] = await db.query("SELECT email, nombre_completo FROM usuarios WHERE idUsuario = ?", [idUsuario]);
        if (users.length === 0) return res.status(404).json({ error: "Usuario no encontrado." });
        
        const user = users[0];
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await db.query("UPDATE usuarios SET reset_code = ?, reset_expires = ? WHERE idUsuario = ?", [code, expires, idUsuario]);

        await notifController.sendEmailNotification(
            user.email,
            "Confirmación de eliminación de cuenta ⚠️",
            `Hola <b>${user.nombre_completo}</b>,<br><br>
            Hemos recibido una solicitud para eliminar permanentemente tu cuenta de Oxyra.<br>
            Tu código de confirmación es:<br><br>
            <b style="font-size: 24px; letter-spacing: 4px; color: #ff3333;">${code}</b><br><br>
            Este código expirará en 15 minutos. Si no has solicitado esto, ignora este mensaje.`
        );

        res.json({ message: "Código de eliminación enviado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar la solicitud de eliminación" });
    }
};

exports.deleteAccount = async (req, res) => {
    const idUsuario = req.user.id;
    const { code } = req.body;
    try {
        const [users] = await db.query("SELECT reset_code, reset_expires FROM usuarios WHERE idUsuario = ?", [idUsuario]);
        
        if (users.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        const user = users[0];

        if (user.reset_code !== code) {
            return res.status(400).json({ error: "Código de verificación incorrecto" });
        }
        
        if (new Date() > new Date(user.reset_expires)) {
            return res.status(400).json({ error: "El código ha expirado" });
        }

        // Proceder a la eliminación
        await db.query("DELETE FROM usuarios WHERE idUsuario = ?", [idUsuario]);

        res.json({ message: "Cuenta eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
