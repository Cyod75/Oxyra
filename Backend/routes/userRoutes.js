const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const routineController = require('../controllers/routineController');
const notifController = require('../controllers/notificationController');
const aiController = require('../controllers/aiController'); 
const workoutController = require('../controllers/workoutController'); 
const productController = require('../controllers/productController');

// --- MIDDLEWARES ---
const authMiddleware = require('../middlewares/authMiddleware');
const proMiddleware = require('../middlewares/proMiddleware');
const upload = require('../config/cloudinary');


//RUTAS DE PERFIL Y USUARIO
router.get('/me', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, upload.single('foto'), userController.updateProfile);
router.get('/search', authMiddleware, userController.searchUsers);
router.put('/change-password', authMiddleware, userController.changePassword);
router.post('/subscribe', authMiddleware, userController.subscribePro);
router.post('/cancel-subscription', authMiddleware, userController.cancelPro);

// Gestión de Notificaciones
router.get('/notifications/status', authMiddleware, notifController.getNotificationStatus);
router.post('/notifications/toggle', authMiddleware, notifController.toggleNotifications);

// Generación con IA
router.post('/generate-routine', authMiddleware, aiController.generateRoutine);
// Generación IA (PROTEGIDA CON DOBLE CANDADO: AUTH + PRO)
router.post('/generate-routine', authMiddleware, proMiddleware, aiController.generateRoutine);

// Gestión Manual y Visualización
router.get('/routines', authMiddleware, routineController.getMyRoutines);
router.get('/exercises', authMiddleware, routineController.getAllExercises);
router.post('/routine/manual', authMiddleware, routineController.createManualRoutine);
router.get('/routine/:id', authMiddleware, routineController.getRoutineDetail);
router.put('/routine/:id', authMiddleware, routineController.updateRoutine);
router.delete('/routine/:id', authMiddleware, routineController.deleteRoutine);

// RUTAS DE ENTRENAMIENTO
router.post('/workout/save', authMiddleware, workoutController.saveWorkoutSession);

// RUTAS DE PRODUCTOS
router.get('/', authMiddleware, productController.getAllProducts);

// BÚSQUEDA Y SOCIAL
router.get('/search', authMiddleware, userController.searchUsers);
router.post('/follow', authMiddleware, userController.followUser);
router.post('/unfollow', authMiddleware, userController.unfollowUser);
router.get('/profile/:username', authMiddleware, userController.getPublicProfile);

module.exports = router;