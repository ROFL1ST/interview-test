const bcrypt = require('bcryptjs');

/**
 * Seed initial user data for testing & review
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Widya Test User',
      email: 'user@widya.ai',
      password: hashedPassword,
      gender: 'male',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      name: 'Nusantara Robotics',
      email: 'engineer@widya.ai',
      password: hashedPassword,
      gender: 'female',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
