const User = require('../models/User');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        caste: user.caste,
        address: user.address,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, gender, caste, address } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (gender) user.gender = gender;
    if (caste !== undefined) user.caste = caste;
    if (address) user.address = { ...user.address, ...address };
    
    // Check profile completion
    user.isProfileComplete = user.checkProfileComplete();
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        caste: user.caste,
        address: user.address,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Update FCM Token
exports.updateFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM token required' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Add token if not exists
    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }
    
    res.json({ success: true, message: 'FCM token updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update FCM token' });
  }
};
