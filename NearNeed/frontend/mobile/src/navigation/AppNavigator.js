import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import RequestFormScreen from '../screens/main/RequestFormScreen';
import RequestDetailScreen from '../screens/main/RequestDetailScreen';
import OfferFormScreen from '../screens/main/OfferFormScreen';
import ChatScreen from '../screens/main/ChatScreen';
import MyRequestsScreen from '../screens/main/MyRequestsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import FavorBankScreen from '../screens/main/FavorBankScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SearchScreen from '../screens/main/SearchScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import HelpScreen from '../screens/main/HelpScreen';

import { colors } from '../constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: colors.white }
    }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Home Stack Navigator
const HomeStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.white }
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen 
      name="RequestForm" 
      component={RequestFormScreen}
      options={{ 
        presentation: 'modal',
        cardStyle: { backgroundColor: 'transparent' }
      }}
    />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    <Stack.Screen 
      name="OfferForm" 
      component={OfferFormScreen}
      options={{ 
        presentation: 'modal',
        cardStyle: { backgroundColor: 'transparent' }
      }}
    />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);

// My Requests Stack Navigator
const MyRequestsStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.white }
    }}
  >
    <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
    <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.white }
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="FavorBank" component={FavorBankScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeStack') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'MyRequestsStack') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'ProfileStack') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Help') {
          iconName = focused ? 'help-circle' : 'help-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.teal,
      tabBarInactiveTintColor: colors.gray,
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 5
      },
      headerShown: false
    })}
  >
    <Tab.Screen 
      name="HomeStack" 
      component={HomeStackNavigator} 
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen 
      name="MyRequestsStack" 
      component={MyRequestsStackNavigator} 
      options={{ tabBarLabel: 'My Requests' }}
    />
    <Tab.Screen 
      name="ProfileStack" 
      component={ProfileStackNavigator} 
      options={{ tabBarLabel: 'Profile' }}
    />
    <Tab.Screen 
      name="Help" 
      component={HelpScreen} 
      options={{ tabBarLabel: 'Help' }}
    />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;