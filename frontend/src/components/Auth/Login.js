import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Phone,
  Facebook,
  Twitter,
  Google,
  LinkedIn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Logo from '../Layout/Logo';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login for demo
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(t('login_failed'));
      }
    } catch (err) {
      setError(t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const socialMediaButtons = [
    { icon: <Facebook />, color: '#1877F2', label: 'Facebook' },
    { icon: <Twitter />, color: '#1DA1F2', label: 'Twitter' },
    { icon: <Google />, color: '#DB4437', label: 'Google' },
    { icon: <LinkedIn />, color: '#0077B5', label: 'LinkedIn' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        p: 3,
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          width: '100%', 
          maxWidth: 450, 
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #0d47a1 0%, #ff9800 100%)',
            p: 4,
            textAlign: 'center',
          }}>
            <Logo size="large" />
            <Typography variant="h5" fontWeight="bold" color="white" sx={{ mt: 2 }}>
              {t('welcome_back')}
            </Typography>
            <Typography variant="body2" color="white">
              {t('login_to_continue')}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t('email_or_phone')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {email.includes('@') ? <Email /> : <Phone />}
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link href="/forgot-password" underline="hover">
                  {t('forgot_password')}?
                </Link>
              </Box>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('login')
                  )}
                </Button>
              </motion.div>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('no_account')}{' '}
                <Link href="/register" fontWeight="bold">
                  {t('sign_up')}
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t('or_continue_with')}
              </Typography>
            </Divider>

            <Box display="flex" gap={2}>
              {socialMediaButtons.map((social) => (
                <motion.div key={social.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    sx={{
                      flex: 1,
                      height: 50,
                      backgroundColor: social.color + '10',
                      color: social.color,
                      border: `1px solid ${social.color}20`,
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/subscription')}
                sx={{ py: 1.5 }}
              >
                {t('view_subscription_plans')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;
