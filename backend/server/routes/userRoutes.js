const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getCurrentUser);
router.put('/profile', auth, userController.updateProfile);

// Admin only routes
router.get('/', auth, checkRole(['admin']), userController.getAllUsers);
router.put('/:userId/role', auth, checkRole(['admin']), userController.updateUserRole);

module.exports = router; 