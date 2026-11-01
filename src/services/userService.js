const userRepository = require('../repositories/userRepository');

/**
 * User Service: Handles user profile business logic
 */
class UserService {
  /**
   * Get user profile by ID
   * @param {number|string} userId
   * @returns {Promise<object>}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Data profil user tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

module.exports = new UserService();
