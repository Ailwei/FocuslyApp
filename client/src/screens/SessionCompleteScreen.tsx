import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Card, PrimaryButton, Screen } from '@/components/UI';
import { Badge } from '@/types/models';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useFocus } from '@/context/FocusContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

export const SessionCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
  const { task, durationMinutes } = route.params;
  const { addSession } = useFocus();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);


  console.log("added session", addSession)

 useEffect(() => {
  console.log("SessionCompleteScreen mounted");

  let isMounted = true;

  console.log("Calling addSession");

  addSession(task, durationMinutes)
    .then((newlyUnlocked) => {
      console.log("addSession finished", newlyUnlocked);

      if (isMounted) {
        setUnlockedBadges(newlyUnlocked);
      }
    })
    .catch((err) => {
      console.error("addSession failed", err);
    });

  return () => {
    isMounted = false;
  };
}, []);
  return (
    <Screen style={styles.center}>
      <View style={styles.checkWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.accentGreen} />
      </View>

      <Text style={styles.title}>Session complete</Text>
      <Text style={styles.subtitle}>
        {task} - {durationMinutes} minutes
      </Text>
      <Text style={styles.message}>Great work. That's another session in the books.</Text>

      {unlockedBadges.map((badge) => (
        <Card key={badge.id} variant="dark" style={styles.badgeCard}>
          <Ionicons name="ribbon-outline" size={28} color={colors.accent} />
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.badgeTitle}>Badge unlocked</Text>
            <Text style={styles.badgeSubtitle}>{badge.title}</Text>
          </View>
        </Card>
      ))}

      <PrimaryButton
        title="Back to dashboard"
        variant="primary"
        onPress={() => navigation.popToTop()}
        style={{ marginTop: spacing.xl, width: '100%' }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrap: {
    marginBottom: verticalScale(spacing.lg),
  },
  title: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xl),
    fontWeight: '800',
    marginBottom: verticalScale(spacing.md),
  },
  subtitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '600',
    marginBottom: verticalScale(spacing.md),
  },
  message: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
    textAlign: 'center',
    marginBottom: verticalScale(spacing.xl),
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: verticalScale(spacing.md),
  },
  badgeTitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
  badgeSubtitle: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
  },
});