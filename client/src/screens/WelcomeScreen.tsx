import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { PrimaryButton, Screen } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'> & { onSkip?: () => void };


export const WelcomeScreen: React.FC<NativeStackScreenProps<AuthStackParamList, any>> = ({ navigation }) => {
  return (
    <Screen style={styles.center}>
      <Text style={styles.logo}>Focusly</Text>
      <Text style={styles.tagline}>Train your focus{'\n'}One session at a time</Text>

      <View style={styles.buttons}>
        <PrimaryButton title="Login" variant="primary" onPress={() => navigation.navigate('Login')} />
        <PrimaryButton
          title="Register With Email"
          onPress={() => navigation.navigate('Register')}
          style={styles.secondaryButton}
        />
        <Text style={styles.or}>OR</Text>
        <PrimaryButton
          title="Start With Gmail"
          onPress={() => navigation.navigate('Register')}
          style={styles.secondaryButton}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xxl),
    fontWeight: '800',
    marginBottom: verticalScale(spacing.sm),
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.md),
    textAlign: 'center',
    marginBottom: verticalScale(spacing.xl),
  },
  buttons: {
    width: '100%',
    gap: scale(spacing.md),
  },
  secondaryButton: {
    backgroundColor: colors.cardMid,
  },
  or: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
