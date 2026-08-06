import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen1 } from '@/screens/OnboardingScreen1';
import { OnboardingScreen2 } from '@/screens/OnboardingScreen2';
import { OnboardingScreen3 } from '@/screens/OnboardingScreen3';

const Stack = createNativeStackNavigator();

export const OnboardingNavigator: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onb1" component={OnboardingScreen1} />
      <Stack.Screen name="Onb2" component={OnboardingScreen2} />
      <Stack.Screen name="Onb3">
        {() => <OnboardingScreen3 onFinish={onFinish} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
