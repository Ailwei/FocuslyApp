import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenTitle, PrimaryButton } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const OnboardingScreen1: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="sparkles" size={72} color={colors.accent} />
        <ScreenTitle>Welcome to Focusly</ScreenTitle>
        <Text style={styles.text}>Build focused habits, one session at a time.</Text>
        <PrimaryButton title="Next" onPress={() => navigation.navigate('Onb2')} variant="primary" fullWidth icon="chevron-forward" />
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
