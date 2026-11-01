const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register({ name, email, password, gender }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email sudah terdaftar. Silakan gunakan email lain');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    return newUser;
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Kombinasi email atau password salah');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Kombinasi email atau password salah');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      },
    };
  }
}

module.exports = new AuthService();
