const jwtService = require('../services/jwt.service');
const User = require('../models/User');
const Admin = require('../models/Admin');

// User Auth Middleware
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyAccessToken(token);
    
    if (decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin token not allowed' });
    }
    
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Optional Auth - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwtService.verifyAccessToken(token);
      
      if (!decoded.isAdmin) {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next(); // Continue without auth
  }
};

// Admin Auth Middleware
exports.adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyAccessToken(token);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin not found or inactive' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
