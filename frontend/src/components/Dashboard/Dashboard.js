import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Speed,
  LocationOn,
  AccessTime,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Groups,
  ElectricCar,
  Directions,
  Notifications,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../contexts/SocketContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    distanceToday: 42.5,
    timeToday: 85,
    safetyScore: 92,
    ecoScore: 88,
    alerts: 2,
  });

  const [trafficData, setTrafficData] = useState([
    { time: '6:00', density: 20 },
    { time: '9:00', density: 85 },
    { time: '12:00', density: 45 },
    { time: '15:00', density: 60 },
    { time: '18:00', density: 90 },
    { time: '21:00', density: 30 },
  ]);

  const [emergencies, setEmergencies] = useState([
    { id: 1, type: 'Accident', location: 'Mombasa Road', time: '2 min ago', severity: 'high' },
    { id: 2, type: 'Traffic Jam', location: 'Thika Road', time: '5 min ago', severity: 'medium' },
    { id: 3, type: 'Road Work', location: 'Ngong Road', time: '15 min ago', severity: 'low' },
  ]);

  const pieData = [
    { name: 'Safe Driving', value: 75, color: '#4caf50' },
    { name: 'Moderate', value: 15, color: '#ff9800' },
    { name: 'Needs Improvement', value: 10, color: '#f44336' },
  ];

  useEffect(() => {
    if (socket) {
      socket.on('emergency-broadcast', (data) => {
        setEmergencies(prev => [{
          id: Date.now(),
          type: data.type || 'Emergency',
          location: 'Near your location',
          time: 'Just now',
          severity: 'high'
        }, ...prev.slice(0, 4)]);
      });
    }
  }, [socket]);

  const StatCard = ({ title, value, icon, color, unit = '', progress }) => (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {value}<Typography component="span" variant="body1" color="text.secondary">{unit}</Typography>
              </Typography>
              {progress && (
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  color={color}
                />
              )}
            </Box>
            <Avatar sx={{ bgcolor: `${color}20`, color }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmergencyItem = ({ emergency }) => {
    const severityColor = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    }[emergency.severity];

    const severityIcon = {
      high: <Warning />,
      medium: <Error />,
      low: <CheckCircle />
    }[emergency.severity];

    return (
      <ListItem
        component={motion.div}
        whileHover={{ x: 5 }}
        sx={{
          borderRadius: 2,
          mb: 1,
          bgcolor: 'background.paper',
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: `${severityColor}.main` }}>
            {severityIcon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                {emergency.type}
              </Typography>
              <Chip label={emergency.severity} size="small" color={severityColor} />
            </Box>
          }
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                {emergency.location}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {emergency.time}
              </Typography>
            </>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t('dashboard')}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Distance Today"
            value={stats.distanceToday}
            unit="km"
            icon={<LocationOn />}
            color="primary"
            progress={70}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Time on Road"
            value={stats.timeToday}
            unit="min"
            icon={<AccessTime />}
            color="secondary"
            progress={60}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Safety Score"
            value={stats.safetyScore}
            unit="/100"
            icon={<Speed />}
            color="success"
            progress={stats.safetyScore}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Alerts"
            value={stats.alerts}
            icon={<Warning />}
            color="error"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Traffic Density Today
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37474f" />
                  <XAxis dataKey="time" stroke="#90a4ae" />
                  <YAxis stroke="#90a4ae" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#132f4c',
                      border: 'none',
                      borderRadius: 8,
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="density" 
                    stroke="#ff9800" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Driving Pattern
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Alerts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Live Emergency Alerts</Typography>
              </Box>
              <List>
                {emergencies.map((emergency) => (
                  <React.Fragment key={emergency.id}>
                    <EmergencyItem emergency={emergency} />
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: 2,
                      }}
                      onClick={() => window.location.href = '/navigation'}
                    >
                      <Directions sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1">Start Navigation</Typography>
                    </Card>
                  </motion.div>
                </Grid>
                
                <Grid item xs={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        borderRadius: 2,
                      }}
                      onClick={() => window.location.href = '/community'}
                    >
                      <Groups sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1">Community</Typography>
                    </Card>
                  </motion.div>
                </Grid>
                
                <Grid item xs={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: 'success.main',
                        color: 'white',
                        borderRadius: 2,
                      }}
                      onClick={() => window.location.href = '/ev-charging'}
                    >
                      <ElectricCar sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1">EV Charging</Typography>
                    </Card>
                  </motion.div>
                </Grid>
                
                <Grid item xs={6}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: 'error.main',
                        color: 'white',
                        borderRadius: 2,
                      }}
                      onClick={() => window.location.href = '/sos'}
                    >
                      <Notifications sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1">SOS Alert</Typography>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
