const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/apiResponse');
const db = require('../config/database');

const router = express.Router();

router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.raw('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  return ApiResponse.success(res, 'OK', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
