import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', variant = 'full' }) => {
  const sizes = {
    small: { fontSize: '1.5rem', iconSize: 24 },
    medium: { fontSize: '2.5rem', iconSize: 40 },
    large: { fontSize: '3.5rem', iconSize: 60 }
  };

  const { fontSize, iconSize } = sizes[size];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            mr: variant === 'full' ? 2 : 0,
          }}
        >
          {/* Inner circle */}
          <Box
            sx={{
              width: iconSize * 0.6,
              height: iconSize * 0.6,
              borderRadius: '50%',
              border: `2px solid #ff9800`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Navigation icon */}
            <Box
              sx={{
                width: iconSize * 0.3,
                height: iconSize * 0.3,
                background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          </Box>
          
          {/* Safety ring */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: `2px solid rgba(255, 152, 0, 0.3)`,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.5 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          />
        </Box>
        
        {variant === 'full' && (
          <Typography
            variant="h1"
            sx={{
              fontSize,
              fontWeight: 800,
              background: 'linear-gradient(45deg, #0d47a1 30%, #ff9800 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Njia<span style={{ color: '#ff9800' }}>Safe</span>
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default Logo;
