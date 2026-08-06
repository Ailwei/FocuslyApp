import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { MainTabNavigator } from '@/navigation/MainTabNavigator';
import { NewSessionScreen } from '@/screens/NewSessionScreen';
import { ActiveSessionScreen } from '@/screens/ActiveSessionScreen';
import { SessionCompleteScreen } from '@/screens/SessionCompleteScreen';
import { OnboardingNavigator } from '@/navigation/OnboardingNavigator';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/Loading';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, loading, signUpInProgress, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (loading || signUpInProgress) return <LoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingNavigator onFinish={() => setShowOnboarding(false)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )
      ) : (
        <>
          <Stack.Screen name="MainTabs">
            {() => <MainTabNavigator onLogout={signOut} />}
          </Stack.Screen>
          <Stack.Screen
            name="NewSession"
            component={NewSessionScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
          <Stack.Screen name="SessionComplete" component={SessionCompleteScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
