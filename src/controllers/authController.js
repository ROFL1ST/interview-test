const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Authentication Controller: Handles incoming HTTP requests for Auth
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password, gender } = req.body;

      const newUser = await authService.register({
        name,
        email,
        password,
        gender,
      });

      return ApiResponse.success(
        res,
        'Registrasi berhasil. Akun Anda telah dibuat',
        newUser,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password,
      });

      return ApiResponse.success(
        res,
        'Login berhasil',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
