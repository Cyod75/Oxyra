const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

// Middleware para procesar errores de validación
const validar = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Ruta de Registro con Validaciones
router.post('/register', [
    check('email', 'El email no es válido').isEmail(),
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validar
], authController.register);

router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

module.exports = router;