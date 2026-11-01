const ApiResponse = require('../utils/apiResponse');

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, `Rute ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error Details]:', err);
  }

  // Handle JSON parse error in request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.error(res, 'Sintaks format JSON pada request body tidak valid', 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server';

  const errors = err.errors || (statusCode >= 500 && process.env.NODE_ENV === 'development' ? err.stack : undefined);

  return ApiResponse.error(res, message, statusCode, errors);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
