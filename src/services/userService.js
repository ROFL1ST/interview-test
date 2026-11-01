const userRepository = require('../repositories/userRepository');

class UserService {
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
