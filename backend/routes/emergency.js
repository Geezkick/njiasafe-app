const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// Create emergency alert
router.post('/', async (req, res) => {
  try {
    const emergency = new Emergency(req.body);
    await emergency.save();
    
    res.status(201).json({
      message: 'Emergency alert created',
      emergency,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get emergencies near location
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    const emergencies = await Emergency.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
      status: { $ne: 'resolved' },
    }).sort({ createdAt: -1 }).limit(20);

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update emergency status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Status updated', emergency });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add responder to emergency
router.post('/:id/responders', async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { $push: { responders: req.body } },
      { new: true }
    );

    res.json({ message: 'Responder added', emergency });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
