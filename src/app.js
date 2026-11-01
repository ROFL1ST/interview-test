const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const setupSwagger = require('./docs/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger (disabled in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Interactive Swagger Documentation at /api-docs
setupSwagger(app);

// Root endpoint welcome message & link to docs
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Selamat datang di REST API Portal Autentikasi - PT Widya Informasi Nusantara', {
    apiDocumentation: '/api-docs',
    endpoints: {
      health: '/api/v1/health',
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      profile: 'GET /api/v1/users/profile',
    },
  });
});

// Mount API version 1
app.use('/api/v1', routes);
// Compatibility alias for /api routes
app.use('/api', routes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
