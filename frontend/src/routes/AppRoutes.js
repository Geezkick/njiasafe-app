import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import SmartNavigation from '../components/Navigation/SmartNavigation';
import EmergencyAlert from '../components/SOS/EmergencyAlert';
import Community from '../components/Community/Community';
import EVCharging from '../components/EVCharging/EVCharging';
import SubscriptionPlans from '../components/Subscription/SubscriptionPlans';
import DashboardLayout from '../components/Layout/DashboardLayout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/navigation" element={
        <PrivateRoute>
          <DashboardLayout>
            <SmartNavigation />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/sos" element={
        <PrivateRoute>
          <DashboardLayout>
            <EmergencyAlert />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/community" element={
        <PrivateRoute>
          <DashboardLayout>
            <Community />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/ev-charging" element={
        <PrivateRoute>
          <DashboardLayout>
            <EVCharging />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/subscription" element={
        <PrivateRoute>
          <DashboardLayout>
            <SubscriptionPlans />
          </DashboardLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
