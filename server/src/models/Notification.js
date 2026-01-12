const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: String,
  data: mongoose.Schema.Types.Mixed,
  targetType: {
    type: String,
    enum: ['all', 'specific', 'location'],
    default: 'all',
  },
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  targetLocation: {
    state: String,
    district: String,
    city: String,
  },
  sentAt: Date,
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  deliveredCount: { type: Number, default: 0 },
  readCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
