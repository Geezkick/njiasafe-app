import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('emergency-broadcast', (data) => {
      console.log('Emergency alert received:', data);
    });

    newSocket.on('v2v-message', (data) => {
      console.log('V2V message received:', data);
    });

    newSocket.on('traffic-update', (data) => {
      console.log('Traffic update:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendLocation = (locationData) => {
    if (socket) {
      socket.emit('location-update', locationData);
    }
  };

  const sendEmergency = (emergencyData) => {
    if (socket) {
      socket.emit('emergency-alert', emergencyData);
    }
  };

  const sendV2VMessage = (messageData) => {
    if (socket) {
      socket.emit('v2v-message', messageData);
    }
  };

  const value = {
    socket,
    sendLocation,
    sendEmergency,
    sendV2VMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
