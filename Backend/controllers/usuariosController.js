const db = require('../db');

// obtener todos los usuarios
exports.getUsuarios = (req, res) => {
    db.query('select * from usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// obtener un usuario por id
exports.getUsuarioById = (req, res) => {
    db.query('select * from usuarios where id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
};

// crear un usuario
exports.createUsuario = (req, res) => {
    const { nombre, email } = req.body;
    db.query('insert into usuarios (nombre, email) values (?, ?)', [nombre, email], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: 'usuario creado', id: result.insertId });
    });
};

// actualizar usuario
exports.updateUsuario = (req, res) => {
    const { nombre, email } = req.body;
    db.query(
        'update usuarios set nombre = ?, email = ? where id = ?',
        [nombre, email, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'usuario actualizado' });
        }
    );
};

// borrar usuario
exports.deleteUsuario = (req, res) => {
    db.query('delete from usuarios where id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: 'usuario eliminado' });
    });
};
