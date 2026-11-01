const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Pendaftaran akun baru (nama, email, password, jenis kelamin)
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login akun dengan email & password
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
