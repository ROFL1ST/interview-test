const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/v1/users/profile
 * @desc    Mendapatkan data profil user yang sedang login
 * @access  Private (Bearer JWT Token)
 */
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
