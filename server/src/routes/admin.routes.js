const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { adminAuth } = require('../middlewares/auth.middleware');

router.get('/stats', adminAuth, adminController.getStats);
router.get('/users', adminAuth, adminController.getUsers);
router.get('/users/:id', adminAuth, adminController.getUser);
router.post('/notifications', adminAuth, adminController.sendNotification);
router.get('/notifications', adminAuth, adminController.getNotifications);

module.exports = router;
