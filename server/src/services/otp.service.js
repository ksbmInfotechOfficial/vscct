const axios = require('axios');
const config = require('../config');
const Otp = require('../models/Otp');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpViaMSG91 = async (phone, otp) => {
  try {
    const response = await axios.post(
      `https://control.msg91.com/api/v5/otp?template_id=${config.otp.templateId}&mobile=91${phone}&otp=${otp}`,
      {},
      {
        headers: {
          'authkey': config.otp.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('MSG91 Error:', error.response?.data || error.message);
    throw error;
  }
};

const sendOtp = async (phone) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + config.otp.expiry * 60 * 1000);
  
  // Delete any existing OTP for this phone
  await Otp.deleteMany({ phone });
  
  // Create new OTP record
  await Otp.create({ phone, otp, expiresAt });
  
  // Send OTP via MSG91 (skip in debug mode)
  if (!config.otp.debug) {
    await sendOtpViaMSG91(phone, otp);
  }
  
  // Return OTP in debug mode for testing
  return config.otp.debug ? otp : null;
};

const verifyOtp = async (phone, otp) => {
  const otpRecord = await Otp.findOne({ phone, otp });
  
  if (!otpRecord) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  if (otpRecord.expiresAt < new Date()) {
    return { valid: false, message: 'OTP expired' };
  }
  
  if (otpRecord.attempts >= 3) {
    return { valid: false, message: 'Too many attempts' };
  }
  
  // Mark as verified and delete
  await Otp.deleteOne({ _id: otpRecord._id });
  
  return { valid: true };
};

module.exports = {
  generateOtp,
  sendOtp,
  verifyOtp,
};
