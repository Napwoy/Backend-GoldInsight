const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rute Publik (Bisa diakses siapa saja)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rute Terproteksi (Hanya bisa diakses jika menyertakan token JWT yang valid)
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

module.exports = router;
