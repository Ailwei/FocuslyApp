import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, fontSizes, fontWeights, shadows } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';

export const Screen: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']}>
    {children}
  </SafeAreaView>
);

export const Card: React.FC<{
  children: React.ReactNode;
  variant?: 'dark' | 'mid' | 'light';
  style?: StyleProp<ViewStyle>;
}> = ({ children, variant = 'dark', style }) => {
  const bg =
    variant === 'dark' ? colors.cardDark : variant === 'mid' ? colors.cardMid : colors.cardLight;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
};

export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}> = ({ title, onPress, variant = 'default', style, textStyle, fullWidth, icon, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'primary' && styles.buttonPrimary,
      fullWidth && styles.buttonFull,
      disabled && styles.buttonDisabled,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled}
  >
    {icon && <Ionicons name={icon} size={18} color={variant === 'primary' ? colors.black : colors.textPrimary} style={styles.buttonIcon} />}
    <Text
      style={[
        styles.buttonText,
        variant === 'primary' && styles.buttonTextPrimary,
        variant === 'danger' && { color: colors.danger },
        textStyle,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export const ScreenTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scale(spacing.lg),
  },
  card: {
    borderRadius: radius.md,
    padding: scale(spacing.md),
    ...shadows.card,
  },
  button: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.md,
    paddingVertical: verticalScale(spacing.sm),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardLight,
    flexDirection: 'row',
    paddingHorizontal: scale(spacing.lg),
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    ...shadows.button,
  },
  buttonFull: {
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: radius.pill,
    paddingVertical: verticalScale(spacing.sm),
  },
  buttonIcon: {
    marginRight: scale(spacing.sm),
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: fontWeights.medium,
  },
  buttonTextPrimary: {
    color: colors.black,
    fontWeight: fontWeights.heavy,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  title: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xl),
    fontWeight: fontWeights.heavy,
    marginTop: verticalScale(spacing.lg),
    marginBottom: verticalScale(spacing.md),
    textAlign: 'center',
    alignSelf: 'center',
  },
});
