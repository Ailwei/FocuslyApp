import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenTitle, PrimaryButton } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const OnboardingScreen2: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="timer" size={72} color={colors.gold} />
        <ScreenTitle>Focused Sessions</ScreenTitle>
        <Text style={styles.text}>Create short, distraction-free sessions and track progress.</Text>
        <PrimaryButton title="Next" onPress={() => navigation.navigate('Onb3')} variant="primary" fullWidth icon="chevron-forward" />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginBottom: spacing.md,
    maxWidth: 320,
  },
});
