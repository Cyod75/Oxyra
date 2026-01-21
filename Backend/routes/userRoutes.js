const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary'); 

router.get('/me', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, upload.single('foto'), userController.updateProfile);
router.get('/search', authMiddleware, userController.searchUsers);

module.exports = router;