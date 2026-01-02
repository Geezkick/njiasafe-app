const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'expired',
    },
    expiresAt: Date,
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'sw'],
      default: 'en',
    },
    navigationMode: {
      type: String,
      enum: ['driving', 'cycling', 'walking', 'motorcycling'],
      default: 'driving',
    },
    notifications: {
      emergency: { type: Boolean, default: true },
      traffic: { type: Boolean, default: true },
      weather: { type: Boolean, default: true },
      community: { type: Boolean, default: true },
    },
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String,
  }],
  vehicleInfo: {
    type: String,
    plateNumber: String,
    insuranceProvider: String,
    policyNumber: String,
  },
  stats: {
    totalDistance: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    safetyScore: { type: Number, default: 0 },
    ecoScore: { type: Number, default: 0 },
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  isVerified: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update method
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('User', userSchema);
