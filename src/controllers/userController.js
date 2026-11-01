const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

/**
 * User Controller: Handles user profile requests
 */
class UserController {
  /**
   * Get authenticated user profile
   * GET /api/v1/users/profile
   */
  async getProfile(req, res, next) {
    try {
      // req.user is populated by authMiddleware
      const userId = req.user.id;
      const profile = await userService.getProfile(userId);

      return ApiResponse.success(
        res,
        'Data profile user berhasil diambil',
        profile,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
