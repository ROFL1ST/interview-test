const app = require('./app');
const env = require('./config/env');
const db = require('./config/database');

const PORT = env.PORT || 3000;

// Test database connection before server start
const startServer = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Berhasil terhubung ke database PostgreSQL');
  } catch (error) {
    console.warn('⚠️  Peringatan: Gagal terhubung ke database saat inisialisasi.');
    console.warn('   Pastikan PostgreSQL sudah berjalan (misal: docker-compose up -d) dan database telah dimigrasi.');
    console.warn(`   Detail error: ${error.message}\n`);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📑 Dokumentasi Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\n🛑 Mematikan server secara aman (Graceful shutdown)...');
    server.close(async () => {
      console.log('🔒 HTTP server ditutup.');
      try {
        await db.destroy();
        console.log('🔒 Koneksi PostgreSQL ditutup.');
      } catch (err) {
        console.error('Error saat menutup database:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
