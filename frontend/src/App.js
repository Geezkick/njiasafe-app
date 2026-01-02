import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import AppRoutes from './routes/AppRoutes';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SubscriptionProvider>
            <SocketProvider>
              <Router>
                <AppRoutes />
              </Router>
            </SocketProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
