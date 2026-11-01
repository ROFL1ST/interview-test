const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const setupSwagger = require('./docs/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

setupSwagger(app);

app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Widya Auth API', {
    docs: '/api-docs',
    endpoints: {
      health: '/api/v1/health',
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      profile: 'GET /api/v1/users/profile',
    },
  });
});

app.use('/api/v1', routes);
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
