const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const contentRoutes = require('./content.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/content', contentRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'VSSCT API is running', timestamp: new Date() });
});

module.exports = router;
