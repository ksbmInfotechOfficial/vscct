const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/admin/login', authController.adminLogin);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
