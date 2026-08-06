import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { PrimaryButton, ScreenTitle, Screen } from '@/components/UI';
import { colors, spacing, radius, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useAuth } from '@/context/AuthContext';

interface Props extends NativeStackScreenProps<AuthStackParamList, 'Register'> {}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    const registerError = await signUp(name.trim(), email.trim(), password);
    setLoading(false);

    if (registerError) {
      setError(registerError);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Screen>
      <View style={styles.centerContainer}>
        <Text style={styles.brand}>Focusly</Text>
        <ScreenTitle>Registration here</ScreenTitle>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
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
            title="Sign Up"
            variant="primary"
            onPress={handleRegister}
            style={{ marginTop: spacing.lg }}
            fullWidth
            disabled={loading}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.switchText} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login
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
