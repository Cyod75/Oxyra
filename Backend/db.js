const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'Oxyra',
    port: 3307 // el puerto real que uses
});

db.connect(err => {
    if (err) {
        console.log('error al conectar:', err);
    } else {
        console.log('conexion mysql correcta');
    }
});

module.exports = db;
