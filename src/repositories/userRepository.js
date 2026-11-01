const db = require('../config/database');

/**
 * User Repository: Handles all database operations for users table
 */
class UserRepository {
  /**
   * Find a user by email address
   * @param {string} email
   * @returns {Promise<object|undefined>}
   */
  async findByEmail(email) {
    return db('users')
      .where({ email: email.toLowerCase() })
      .first();
  }

  /**
   * Find a user by ID (excludes password by default for security)
   * @param {number|string} id
   * @param {boolean} includePassword
   * @returns {Promise<object|undefined>}
   */
  async findById(id, includePassword = false) {
    const query = db('users').where({ id });
    if (!includePassword) {
      query.select('id', 'name', 'email', 'gender', 'created_at', 'updated_at');
    }
    return query.first();
  }

  /**
   * Create a new user record
   * @param {object} userData
   * @returns {Promise<object>} Created user (excluding password)
   */
  async create(userData) {
    const [createdUser] = await db('users')
      .insert({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        gender: userData.gender.toLowerCase(),
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning(['id', 'name', 'email', 'gender', 'created_at', 'updated_at']);

    return createdUser;
  }
}

module.exports = new UserRepository();
