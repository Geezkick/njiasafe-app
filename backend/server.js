const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const redis = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nijasafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Models
const User = require('./models/User');
const Emergency = require('./models/Emergency');

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('v2v-message', (data) => {
    socket.broadcast.emit('v2v-message', data);
  });

  socket.on('emergency-alert', async (data) => {
    try {
      const emergency = new Emergency({
        ...data,
        socketId: socket.id,
        timestamp: new Date()
      });
      await emergency.save();
      
      io.emit('emergency-broadcast', {
        ...data,
        emergencyId: emergency._id,
        timestamp: new Date()
      });
      
      notifyAuthorities(data);
    } catch (error) {
      console.error('Emergency alert error:', error);
    }
  });

  socket.on('location-update', (data) => {
    redisClient.setEx(
      `location:${data.userId}`,
      60,
      JSON.stringify(data)
    );
    updateTrafficData(data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/navigation', require('./routes/navigation'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/mpesa', require('./routes/mpesa'));

// EV Charging Stations
app.get('/api/ev-charging', async (req, res) => {
  try {
    const stations = await redisClient.get('ev-charging-stations');
    res.json(JSON.parse(stations) || getDefaultChargingStations());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weather and Road Conditions
app.get('/api/road-conditions', async (req, res) => {
  try {
    const conditions = await fetchRoadConditions();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Driver Analytics
app.get('/api/analytics/:userId', async (req, res) => {
  try {
    const analytics = await generateDriverAnalytics(req.params.userId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper functions
async function notifyAuthorities(emergencyData) {
  console.log('Notifying authorities:', emergencyData);
}

async function updateTrafficData(locationData) {
  const key = `traffic:${Math.floor(locationData.coordinates.lat * 100)}_${Math.floor(locationData.coordinates.lng * 100)}`;
  await redisClient.incr(key);
  await redisClient.expire(key, 300);
}

async function fetchRoadConditions() {
  return {
    weather: 'Sunny',
    temperature: 25,
    traffic: 'Moderate',
    roadCondition: 'Good',
    alerts: []
  };
}

async function generateDriverAnalytics(userId) {
  return {
    totalDistance: 1250,
    totalTime: 180,
    averageSpeed: 45,
    safetyScore: 85,
    ecoScore: 78,
    recentTrips: []
  };
}

function getDefaultChargingStations() {
  return [
    {
      id: 1,
      name: 'Garden City EV Hub',
      location: { lat: -1.272, lng: 36.821 },
      address: 'Garden City Mall, Thika Road',
      rating: 4.5,
      price: 45,
      speed: 'Fast',
      available: 4,
      total: 8,
      amenities: ['Cafe', 'WiFi', 'Restrooms'],
    },
    {
      id: 2,
      name: 'Two Rivers Charging',
      location: { lat: -1.222, lng: 36.876 },
      address: 'Two Rivers Mall, Limuru Road',
      rating: 4.2,
      price: 42,
      speed: 'Super Fast',
      available: 6,
      total: 10,
      amenities: ['Shopping', 'Food Court', 'WiFi'],
    }
  ];
}
