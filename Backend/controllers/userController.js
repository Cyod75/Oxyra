const db = require('../config/db');
const bcrypt = require('bcryptjs');
const notifController = require('./notificationController');

// PERFIL DE USUARIO
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Datos básicos del usuario
        // CORRECCIÓN: Añadidos peso_kg, estatura_cm y genero a la selección
        const [user] = await db.query(
            "SELECT idUsuario, username, nombre_completo, foto_perfil, biografia, rango_global, es_pro, peso_kg, estatura_cm, genero FROM usuarios WHERE idUsuario = ?", 
            [userId]
        );
        
        if (user.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        // 2. CONTADORES REALES (Seguidores, Seguidos, Entrenos)
        const [counts] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM seguidores WHERE seguido_id = ?) as seguidores,
                (SELECT COUNT(*) FROM seguidores WHERE seguidor_id = ?) as seguidos,
                (SELECT COUNT(*) FROM historial_workouts WHERE usuario_id = ?) as entrenos
        `, [userId, userId, userId]);

        // 3. Stats Musculares (Symmetry)
        const [muscularStats] = await db.query(
            "SELECT grupo_muscular, rango_actual, fuerza_teorica_max FROM stats_musculares WHERE usuario_id = ?",
            [userId]
        );

        // Combinamos todo en la respuesta
        res.json({ 
            ...user[0], 
            stats: counts[0], // Aquí van los números reales
            muscularStats 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ACTUALIZAR PERFIL
exports.updateProfile = async (req, res) => {
    const { nombre_completo, biografia, peso_kg, estatura_cm, genero } = req.body;
    let foto_perfil_url;

    try {
        if (req.file) {
            foto_perfil_url = req.file.path;
        } else {
            const [currentUser] = await db.query("SELECT foto_perfil FROM usuarios WHERE idUsuario = ?", [req.user.id]);
            foto_perfil_url = currentUser[0].foto_perfil;
        }

        await db.query(
            `UPDATE usuarios 
             SET nombre_completo = ?, biografia = ?, foto_perfil = ?, peso_kg = ?, estatura_cm = ?, genero = ? 
             WHERE idUsuario = ?`,
            [nombre_completo, biografia, foto_perfil_url, peso_kg || null, estatura_cm || null, genero || null, req.user.id]
        );

        res.json({ message: "Perfil actualizado", foto_perfil: foto_perfil_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// BUSCAR USUARIOS
exports.searchUsers = async (req, res) => {
    const { query } = req.query;
    const myId = req.user.id;

    try {
        // SQL: Busca usuarios por nombre Y comprueba en la tabla seguidores si existe relación
        const sql = `
            SELECT 
                u.idUsuario, 
                u.username, 
                u.nombre_completo, 
                u.foto_perfil, 
                u.rango_global,
                (SELECT COUNT(*) FROM seguidores s WHERE s.seguidor_id = ? AND s.seguido_id = u.idUsuario) as lo_sigo
            FROM usuarios u
            WHERE u.username LIKE ? AND u.idUsuario != ?
            LIMIT 20
        `;

        const [users] = await db.query(sql, [myId, `%${query}%`, myId]);
        
        // Convertimos el 1/0 de SQL a true/false para React
        const formatted = users.map(u => ({
            ...u,
            lo_sigo: u.lo_sigo === 1
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SEGUIR USUARIO
exports.followUser = async (req, res) => {
    const { idUsuarioASequir } = req.body;
    const myId = req.user.id;

    if (parseInt(idUsuarioASequir) === myId) return res.status(400).json({ error: "No te puedes seguir a ti mismo" });

    try {
        await db.query(
            "INSERT IGNORE INTO seguidores (seguidor_id, seguido_id) VALUES (?, ?)",
            [myId, idUsuarioASequir]
        );
        res.json({ message: "Usuario seguido", lo_sigo: true });
    } catch (err) {
        res.status(500).json({ error: "Error al seguir" });
    }
};

// DEJAR DE SEGUIR
exports.unfollowUser = async (req, res) => {
    const { idUsuarioADejar } = req.body;
    const myId = req.user.id;

    try {
        await db.query(
            "DELETE FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?",
            [myId, idUsuarioADejar]
        );
        res.json({ message: "Dejado de seguir", lo_sigo: false });
    } catch (err) {
        res.status(500).json({ error: "Error al dejar de seguir" });
    }
};

exports.getPublicProfile = async (req, res) => {
    const { username } = req.params;
    const myId = req.user.id;

    try {
        // 1. Buscar al usuario por username
        const [users] = await db.query(`
            SELECT 
                idUsuario, username, nombre_completo, foto_perfil, biografia, rango_global, es_pro,
                -- Verificamos si YO (myId) sigo a este usuario
                (SELECT COUNT(*) FROM seguidores WHERE seguidor_id = ? AND seguido_id = usuarios.idUsuario) as lo_sigo
            FROM usuarios 
            WHERE username = ?`, 
            [myId, username]
        );

        if (users.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const targetUser = users[0];
        const targetId = targetUser.idUsuario;

        // 2. CONTADORES REALES de ese usuario
        const [counts] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM seguidores WHERE seguido_id = ?) as seguidores,
                (SELECT COUNT(*) FROM seguidores WHERE seguidor_id = ?) as seguidos,
                (SELECT COUNT(*) FROM historial_workouts WHERE usuario_id = ?) as entrenos
        `, [targetId, targetId, targetId]);

        res.json({ 
            ...targetUser, 
            lo_sigo: targetUser.lo_sigo === 1,
            stats: counts[0] 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CAMBIAR CONTRASEÑA
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Faltan datos" });

    try {
        const [users] = await db.query("SELECT password_hash, email, nombre_completo FROM usuarios WHERE idUsuario = ?", [req.user.id]);
        const user = users[0];

        if (!user.password_hash) return res.status(400).json({ error: "Tu cuenta usa Google Login." });

        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) return res.status(401).json({ error: "La contraseña actual es incorrecta" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE usuarios SET password_hash = ? WHERE idUsuario = ?", [newHash, req.user.id]);

        try {
            await notifController.sendEmailNotification(
                user.email,
                "Alerta de Seguridad: Tu contraseña ha cambiado 🔐",
                `Hola <b>${user.nombre_completo}</b>,<br>La contraseña de tu cuenta Oxyra ha sido modificada.`
            );
        } catch (emailErr) { console.error("Error email pass:", emailErr); }

        res.json({ message: "Contraseña actualizada correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// SUSCRIPCIÓN PRO
exports.subscribePro = async (req, res) => {
    try {
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 30);

        await db.query("UPDATE usuarios SET es_pro = 1, fecha_fin_suscripcion = ? WHERE idUsuario = ?", [fechaFin, req.user.id]);

        const [u] = await db.query("SELECT email, nombre_completo FROM usuarios WHERE idUsuario = ?", [req.user.id]);
        if (u.length > 0) {
            await notifController.sendEmailNotification(
                u[0].email, 
                "¡Bienvenido a Oxyra PRO! 🚀", 
                `¡Enhorabuena, <b>${u[0].nombre_completo}</b>! Has desbloqueado todo el potencial de Oxyra.`
            );
        }
        res.json({ message: "Suscripción activada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CANCELAR PRO
exports.cancelPro = async (req, res) => {
    try {
        await db.query("UPDATE usuarios SET es_pro = 0, fecha_fin_suscripcion = NULL WHERE idUsuario = ?", [req.user.id]);
        res.json({ message: "Suscripción cancelada correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al cancelar" });
    }
};