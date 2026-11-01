const app = require('./app');
const env = require('./config/env');
const db = require('./config/database');

const PORT = env.PORT || 3000;

const startServer = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      try {
        await db.destroy();
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
