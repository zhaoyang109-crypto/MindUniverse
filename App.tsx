import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import LandingScreen from './src/screens/LandingScreen';

const AUTH_KEY = '@mind_universe_authenticated';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const value = await AsyncStorage.getItem(AUTH_KEY);
      if (value === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
    setIsChecking(false);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (isChecking) {
    return null; // Splash/loading state
  }

  if (!isAuthenticated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <LandingScreen onAuthenticated={handleAuthenticated} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
