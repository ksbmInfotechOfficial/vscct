require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  otp: {
    provider: process.env.OTP_PROVIDER || 'msg91',
    apiKey: process.env.OTP_API_KEY,
    debug: process.env.OTP_DEBUG === 'true',
    senderId: process.env.MSG91_SENDER_ID || 'VSSCT',
    templateId: process.env.MSG91_TEMPLATE_ID,
    expiry: parseInt(process.env.MSG91_EXPIRY) || 5,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@vssct.com',
    password: process.env.ADMIN_PASSWORD || 'Ksbm@12345',
  },
  wpApiUrl: process.env.WP_API_URL || 'https://vssct.com/wp-json/wp/v2',
};
