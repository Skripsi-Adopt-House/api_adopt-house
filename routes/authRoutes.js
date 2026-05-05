const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /auth/register - Register user baru
router.post('/register', register);

// POST /auth/login - Login user
router.post('/login', login);

// POST /auth/logout - Logout user
router.post('/logout', authMiddleware, logout);

module.exports = router;
