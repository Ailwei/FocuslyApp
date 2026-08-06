import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenTitle, PrimaryButton } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';

export const OnboardingScreen3: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="trophy" size={72} color={colors.gold} />
        <ScreenTitle>Earn Badges</ScreenTitle>
        <Text style={styles.text}>Earn badges for milestones and celebrate focused wins.</Text>
        <PrimaryButton
          title="Get Started"
          onPress={() => {
            if (onFinish) onFinish();
            else (navigation as any)?.navigate?.('Auth');
          }}
          variant="primary"
          fullWidth
          icon="checkmark-done"
        />
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
