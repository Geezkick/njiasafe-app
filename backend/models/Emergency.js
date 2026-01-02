const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['accident', 'medical', 'breakdown', 'crime', 'other'],
    default: 'other',
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'responded', 'resolved', 'cancelled'],
    default: 'pending',
  },
  responders: [{
    type: { type: String, enum: ['police', 'ambulance', 'fire', 'community'] },
    status: String,
    arrivedAt: Date,
  }],
  socketId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

emergencySchema.index({ coordinates: '2dsphere' });
emergencySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Emergency', emergencySchema);
