const User = require('../models/User');
const Admin = require('../models/Admin');
const otpService = require('../services/otp.service');
const jwtService = require('../services/jwt.service');
const config = require('../config');

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone required' });
    }
    
    const otpPreview = await otpService.sendOtp(phone);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: config.otp.debug ? { otp: otpPreview } : {},
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }
    
    const result = await otpService.verifyOtp(phone, otp);
    
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }
    
    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;
    
    if (!user) {
      user = await User.create({ phone });
      isNewUser = true;
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const tokens = jwtService.generateTokens(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar,
          isProfileComplete: user.isProfileComplete,
        },
        isNewUser,
        ...tokens,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    // Auto-seed admin if not exists
    let admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin && email.toLowerCase() === config.admin.email.toLowerCase()) {
      admin = await Admin.create({
        email: config.admin.email,
        password: config.admin.password,
        name: 'Super Admin',
        role: 'superadmin',
      });
    }
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    admin.lastLogin = new Date();
    await admin.save();
    
    const tokens = jwtService.generateTokens(admin._id, true);
    
    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        ...tokens,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const tokens = jwtService.generateTokens(decoded.id, decoded.isAdmin);
    
    res.json({ success: true, data: tokens });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};
