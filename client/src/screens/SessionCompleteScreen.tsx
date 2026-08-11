import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Card, PrimaryButton, Screen } from '@/components/UI';
import { Badge } from '@/types/models';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useFocus } from '@/context/FocusContext';
import { computeSessionInsight } from '@/utils/sessionInsights';
import { BadgeUnlockModal } from '@/components/BadgeUnlockModal';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

export const SessionCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
  const { task, durationMinutes, distractions = [], sessionStartedAt } = route.params;
  const { addSession } = useFocus();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);

  const insight = useMemo(
    () =>
      sessionStartedAt
        ? computeSessionInsight(distractions, sessionStartedAt, durationMinutes)
        : null,
    [distractions, sessionStartedAt, durationMinutes]
  );

  useEffect(() => {
    let isMounted = true;

    addSession(task, durationMinutes, distractions)
      .then((newlyUnlocked) => {
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

   {insight && (
  <Card variant="dark" style={styles.insightCard}>
    <View style={styles.insightHeader}>
      <Ionicons
        name={
          insight.distractionCount === 0
            ? 'checkmark-done-outline'
            : 'bulb-outline'
        }
        size={24}
        color={colors.accent}
      />
      <Text style={styles.insightHeadline}>
        {insight.headline}
      </Text>
    </View>
  </Card>
)}

{distractions.length > 0 && (
  <Card variant="dark" style={styles.distractionCard}>
    <Text style={styles.distractionTitle}>
      Distractions
    </Text>

    {distractions.map((distraction) => (
      <View
        key={distraction.id}
        style={styles.distractionItem}
      >
        <Ionicons
          name="phone-portrait-outline"
          size={20}
          color={colors.accent}
        />

        <View style={styles.distractionText}>
          <Text style={styles.distractionApp}>
            {distraction.appName || 'Unknown app'}
          </Text>

          <Text style={styles.distractionTime}>
            {distraction.durationSeconds ?? 0} seconds lost
          </Text>
        </View>
      </View>
    ))}
  </Card>
)}

      <PrimaryButton
        title="Back to dashboard"
        variant="primary"
        onPress={() => navigation.navigate("MainTabs")}
        style={{ marginTop: spacing.xl, width: '100%' }}
      />

      <BadgeUnlockModal badges={unlockedBadges} />
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
  insightCard: {
    width: '100%',
    marginBottom: verticalScale(spacing.md),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightHeadline: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.sm),
    fontWeight: '700',
    marginLeft: spacing.md,
  },
  distractionCard: {
  width: '100%',
  marginBottom: verticalScale(spacing.md),
},

distractionTitle: {
  color: colors.textPrimary,
  fontSize: normalizeFontSize(fontSizes.md),
  fontWeight: '700',
  marginBottom: verticalScale(spacing.sm),
},

distractionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: verticalScale(spacing.sm),
},

distractionText: {
  flex: 1,
  marginLeft: spacing.md,
},

distractionApp: {
  color: colors.textPrimary,
  fontSize: normalizeFontSize(fontSizes.sm),
  fontWeight: '700',
},

distractionTime: {
  color: colors.textSecondary,
  fontSize: normalizeFontSize(fontSizes.sm),
  marginTop: 2,
},
});