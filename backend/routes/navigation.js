const express = require('express');
const router = express.Router();
const axios = require('axios');

// Calculate route
router.post('/route', async (req, res) => {
  try {
    const { start, end, mode = 'driving' } = req.body;
    
    // For demo, return mock data
    const mockRoute = {
      distance: 15.2,
      duration: 25,
      polyline: [
        [-1.286, 36.817],
        [-1.280, 36.820],
        [-1.275, 36.825],
        [-1.270, 36.830],
      ],
      steps: [
        { instruction: 'Head north on Mombasa Road', distance: 2.5, duration: 5 },
        { instruction: 'Turn right onto Uhuru Highway', distance: 8.7, duration: 15 },
        { instruction: 'Continue straight to destination', distance: 4.0, duration: 5 },
      ],
      traffic: {
        level: 'moderate',
        delay: 5,
      },
      weather: {
        condition: 'sunny',
        temperature: 25,
      },
    };

    res.json(mockRoute);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get traffic data
router.get('/traffic', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Mock traffic data
    const trafficData = {
      density: Math.floor(Math.random() * 100),
      incidents: [
        { type: 'accident', location: 'Mombasa Road', severity: 'high' },
        { type: 'congestion', location: 'Thika Road', severity: 'medium' },
      ],
      averageSpeed: 45,
      forecast: [
        { hour: '09:00', density: 85 },
        { hour: '10:00', density: 75 },
        { hour: '11:00', density: 65 },
        { hour: '12:00', density: 55 },
      ],
    };

    res.json(trafficData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get alternative routes
router.get('/alternatives', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const alternatives = [
      {
        id: 1,
        distance: 15.2,
        duration: 25,
        traffic: 'moderate',
        toll: false,
        description: 'Fastest route via Mombasa Road',
      },
      {
        id: 2,
        distance: 14.8,
        duration: 28,
        traffic: 'light',
        toll: false,
        description: 'Scenic route via Langata Road',
      },
      {
        id: 3,
        distance: 16.5,
        duration: 22,
        traffic: 'heavy',
        toll: true,
        description: 'Expressway - Toll road',
      },
    ];

    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
