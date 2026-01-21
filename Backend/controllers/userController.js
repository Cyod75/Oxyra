const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        // Obtenemos datos del usuario + sus estadísticas musculares
        const [user] = await db.query(
            "SELECT idUsuario, username, nombre_completo, foto_perfil, biografia, rango_global, es_pro FROM usuarios WHERE idUsuario = ?", 
            [req.user.id]
        );
        
        const [stats] = await db.query(
            "SELECT grupo_muscular, rango_actual, fuerza_teorica_max FROM stats_musculares WHERE usuario_id = ?",
            [req.user.id]
        );

        res.json({ ...user[0], stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    // Multer pone los datos de texto en body y el archivo en file
    const { nombre_completo, biografia } = req.body;
    let foto_perfil_url;

    try {
        // ¿El usuario subió una foto nueva?
        if (req.file) {
            // SÍ: Usamos la URL que Cloudinary nos devolvió
            foto_perfil_url = req.file.path;
        } else {
            // NO: Buscamos la foto actual en la base de datos para no perderla
            const [currentUser] = await db.query("SELECT foto_perfil FROM usuarios WHERE idUsuario = ?", [req.user.id]);
            foto_perfil_url = currentUser[0].foto_perfil;
        }

        await db.query(
            "UPDATE usuarios SET nombre_completo = ?, biografia = ?, foto_perfil = ? WHERE idUsuario = ?",
            [nombre_completo, biografia, foto_perfil_url, req.user.id]
        );

        // Devolvemos la URL actualizada para que el frontend la muestre al instante
        res.json({ message: "Perfil actualizado", foto_perfil: foto_perfil_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
        const [users] = await db.query(
            "SELECT idUsuario, username, foto_perfil, rango_global FROM usuarios WHERE username LIKE ? LIMIT 10",
            [`%${query}%`]
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};