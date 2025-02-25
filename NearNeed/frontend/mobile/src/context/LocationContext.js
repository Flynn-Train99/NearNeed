import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Check for stored location first
        const storedLocation = await AsyncStorage.getItem('userLocation');
        if (storedLocation) {
          setLocation(JSON.parse(storedLocation));
        }

        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newLocation = {
          lat: currentLocation.coords.latitude,
          lon: currentLocation.coords.longitude
        };

        // Store location
        await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
        setLocation(newLocation);

        // Update user location if authenticated
        if (isAuthenticated && user) {
          await axios.patch(`${API_URL}/users/location`, { location: newLocation });
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Could not get your location');
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, [isAuthenticated, user]);

  // Update location
  const updateLocation = async () => {
    try {
      setIsLoading(true);
      
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        lat: currentLocation.coords.latitude,
        lon: currentLocation.coords.longitude
      };

      // Store location
      await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
      setLocation(newLocation);

      // Update user location if authenticated
      if (isAuthenticated && user) {
        await axios.patch(`${API_URL}/users/location`, { location: newLocation });
      }

      return { success: true, location: newLocation };
    } catch (error) {
      console.error('Error updating location:', error);
      return { 
        success: false, 
        error: 'Could not update your location' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    location,
    errorMsg,
    isLoading,
    updateLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};