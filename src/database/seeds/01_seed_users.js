const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

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
