import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import { SOCKET_URL } from '../config';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { location } = useLocation();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to socket server
  useEffect(() => {
    if (isAuthenticated && user && location) {
      // Initialize socket connection
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true
      });

      // Socket event handlers
      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
        
        // Join with user ID and location
        newSocket.emit('join', {
          userId: user.id,
          location
        });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user, location]);

  // Update location in socket when location changes
  useEffect(() => {
    if (socket && isConnected && user && location) {
      socket.emit('update-location', {
        userId: user.id,
        location
      });
    }
  }, [socket, isConnected, user, location]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};