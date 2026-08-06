import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { PrimaryButton, ScreenTitle, Screen } from '@/components/UI';
import { colors, spacing, radius, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useAuth } from '@/context/AuthContext';

interface Props extends NativeStackScreenProps<AuthStackParamList, 'Login'> {}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    const signInError = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
    }
  };

  return (
    <Screen>
      <View style={styles.centerContainer}>
        <Text style={styles.brand}>Focusly</Text>
        <ScreenTitle>Login here</ScreenTitle>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            title="Login"
            variant="primary"
            onPress={handleLogin}
            style={{ marginTop: spacing.lg }}
            fullWidth
            disabled={loading}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.switchText} onPress={() => navigation.navigate('Register')}>
          Don't have an account? Sign up
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  brand: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.lg),
    fontWeight: '700',
    marginTop: verticalScale(spacing.lg),
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.sm,
    paddingHorizontal: scale(spacing.md),
    paddingVertical: verticalScale(spacing.md),
    marginBottom: verticalScale(spacing.md),
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    width: '100%',
    maxWidth: 420,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: verticalScale(spacing.lg),
  },
  error: {
    color: colors.danger,
    marginTop: verticalScale(spacing.sm),
    textAlign: 'center',
  },
});
