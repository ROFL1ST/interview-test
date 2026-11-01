const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);

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
