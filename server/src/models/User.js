const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  district: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  caste: String,
  address: addressSchema,
  avatar: String,
  fcmTokens: [String],
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

userSchema.methods.checkProfileComplete = function() {
  return !!(this.name && this.dateOfBirth && this.gender && this.address?.city && this.address?.state);
};

module.exports = mongoose.model('User', userSchema);
