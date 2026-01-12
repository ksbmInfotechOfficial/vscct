const User = require('../models/User');
const Notification = require('../models/Notification');

// Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const completeProfiles = await User.countDocuments({ isProfileComplete: true });
    const totalNotifications = await Notification.countDocuments();
    
    // Users by state
    const usersByState = await User.aggregate([
      { $match: { 'address.state': { $exists: true, $ne: '' } } },
      { $group: { _id: '$address.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        completeProfiles,
        totalNotifications,
        usersByState: usersByState.map(s => ({ state: s._id, count: s.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
};

// Get Users List
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, state, city } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (state) query['address.state'] = state;
    if (city) query['address.city'] = city;
    
    const users = await User.find(query)
      .select('-fcmTokens')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

// Get Single User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// Send Notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, body, image, targetType, targetUsers, targetLocation } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body required' });
    }
    
    const notification = await Notification.create({
      title,
      body,
      image,
      targetType: targetType || 'all',
      targetUsers,
      targetLocation,
      sentAt: new Date(),
      sentBy: req.admin.id,
    });
    
    // TODO: Implement actual push notification via Firebase
    // For now, just save the notification record
    
    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};

// Get Notifications
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const notifications = await Notification.find()
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments();
    
    res.json({
      success: true,
      data: {
        notifications,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get notifications' });
  }
};
