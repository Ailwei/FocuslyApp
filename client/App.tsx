import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FocusProvider } from '@/context/FocusContext';
import { AuthProvider } from '@/context/AuthContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { BadgeProvider } from '@/context/BadgeContext';
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
  <BadgeProvider>
    <FocusProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </FocusProvider>
  </BadgeProvider>
</AuthProvider>
    </SafeAreaProvider>
  );
}
