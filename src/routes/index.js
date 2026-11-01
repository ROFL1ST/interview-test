const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/apiResponse');
const db = require('../config/database');

const router = express.Router();

// Root API Health Check
router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.raw('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  return ApiResponse.success(res, 'Widya Robotics Auth API is running smoothly', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Auth Routes (/api/v1/auth)
router.use('/auth', authRoutes);

// User Routes (/api/v1/users)
router.use('/users', userRoutes);

// Profile direct alias endpoint (/api/v1/profile)
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
