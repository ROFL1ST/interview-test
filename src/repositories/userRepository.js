const db = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    return db('users')
      .where({ email: email.toLowerCase() })
      .first();
  }

  async findById(id, includePassword = false) {
    const query = db('users').where({ id });
    if (!includePassword) {
      query.select('id', 'name', 'email', 'gender', 'created_at', 'updated_at');
    }
    return query.first();
  }

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
