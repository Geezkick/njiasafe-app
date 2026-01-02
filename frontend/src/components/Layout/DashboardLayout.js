import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Settings,
  Person,
  ExitToApp,
  Language,
  Dashboard,
  Navigation,
  LocationOn,
  Groups,
  ElectricCar,
  Security,
  Assignment,
  WbSunny,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'smart_navigation', icon: <Navigation />, path: '/navigation' },
  { text: 'sos_emergency', icon: <LocationOn />, path: '/sos' },
  { text: 'community', icon: <Groups />, path: '/community' },
  { text: 'ev_charging', icon: <ElectricCar />, path: '/ev-charging' },
  { text: 'road_security', icon: <Security />, path: '/security' },
  { text: 'insurance', icon: <Assignment />, path: '/insurance' },
  { text: 'weather', icon: <WbSunny />, path: '/weather' },
];

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo size="large" />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem
              button
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                mx: 2,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  borderLeft: `4px solid ${theme.palette.secondary.main}`,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={t(item.text)} 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'rgba(13, 71, 161, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t(menuItems.find(item => item.path === location.pathname)?.text || 'dashboard')}
          </Typography>
          
          <IconButton color="inherit" onClick={() => changeLanguage(i18n.language === 'en' ? 'sw' : 'en')}>
            <Language />
            <Typography variant="caption" sx={{ ml: 1 }}>
              {i18n.language === 'en' ? 'SW' : 'EN'}
            </Typography>
          </IconButton>
          
          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
              <Person />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 2 }} />
              {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              {t('settings')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 2 }} />
              {t('logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
