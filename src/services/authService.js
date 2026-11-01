const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Authentication Service: Handles business logic for registration and login
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} param0
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.password
   * @param {string} param0.gender
   * @returns {Promise<object>} Created user data
   */
  async register({ name, email, password, gender }) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email sudah terdaftar. Silakan gunakan email lain');
      error.statusCode = 409;
      throw error;
    }

    // Hash the password securely
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    return newUser;
  }

  /**
   * Login an existing user
   * @param {object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login({ email, password }) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Kombinasi email atau password salah');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Kombinasi email atau password salah');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(tokenPayload);

    // Return token and sanitized user details
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
    };

    return {
      token,
      user: sanitizedUser,
    };
  }
}

module.exports = new AuthService();
