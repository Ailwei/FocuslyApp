import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { Card, Screen } from '@/components/UI';
import { RecentSessions } from '@/components/RecentSessions';
import { colors, spacing, radius, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useFocus } from '@/context/FocusContext';
import { useBadges } from '@/context/BadgeContext';
function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { profile, sessions, stats } = useFocus();

  console.log("profile", profile, "sessions", sessions, "stats", stats)

  const { badges } = useBadges();

  console.log("bages", badges)

  const unlockedBadges = badges.filter(
    (badge: { unlocked: any; }) => badge.unlocked
  );

  const todayMinutes = sessions
    .filter((s) => new Date(s.completedAt).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <Screen>
      <Text style={styles.welcome}>Welcome Back, {profile?.name}</Text>
      <Text style={styles.subtitle}>Ready for next focus session?</Text>

      <View style={styles.row}>
        <Card variant="mid" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <Text style={styles.statValue}>{formatMinutes(todayMinutes)}</Text>
        </Card>
        <Card variant="mid" style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="flame-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <Text style={styles.statValue}>{stats.totalSessions}</Text>
        </Card>
      </View>

      <Card
        variant="mid"
        style={styles.newSessionCard}
      >
        <Ionicons name="play-circle" size={22} color={colors.accent} />
        <Text
          style={styles.newSessionText}
          onPress={() => navigation.navigate('NewSession')}
        >
          New Focus session
        </Text>
      </Card>

      <Card variant="mid" style={styles.badgeSummaryCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.sectionLabel}>Badges</Text>
           <Text style={styles.badgeSummaryText}>
  {unlockedBadges.length} unlocked
</Text>

{unlockedBadges.length > 0 ? (
  <Text 
    style={styles.badgePreview}
    numberOfLines={1}
  >
    Latest: {unlockedBadges[unlockedBadges.length - 1].title}
  </Text>
) : (
  <Text style={styles.badgePreview}>
    No badges yet
  </Text>
)}
          </View>
          <Text
            style={styles.badgeCTA}
            onPress={() => (navigation as any).navigate('Badges')}
          >
            View
          </Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Recent</Text>
      <RecentSessions sessions={sessions.slice(0, 5)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  welcome: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xl),
    fontWeight: '800',
    marginTop: verticalScale(spacing.lg),
    textAlign: 'center',
    alignSelf: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.md),
    marginBottom: verticalScale(spacing.lg),
    textAlign: 'center',
    alignSelf: 'center',
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
    marginBottom: verticalScale(spacing.sm),
    marginTop: verticalScale(spacing.md),
  },
  row: {
    flexDirection: 'row',
    gap: scale(spacing.md),
    marginBottom: verticalScale(spacing.md),
  },
  statCard: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(spacing.xs),
    marginBottom: verticalScale(spacing.sm),
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.lg),
    fontWeight: '700',
  },
  newSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(spacing.sm),
    marginBottom: verticalScale(spacing.xl),
  },
  newSessionText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.lg),
    fontWeight: '700',
    marginBottom: verticalScale(spacing.md),
  },
  badgeSummaryCard: {
    paddingVertical: verticalScale(spacing.md),
    paddingHorizontal: scale(spacing.md),
    marginBottom: verticalScale(spacing.md),
  },
  badgeSummaryText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
    marginTop: verticalScale(spacing.xs),
  },
  badgePreview: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
    marginTop: verticalScale(spacing.xs),
    maxWidth: scale(180),
  },
  badgeCTA: {
    color: colors.accent,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(spacing.md),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textMuted,
    gap: scale(spacing.md),
  },
  historyTextWrap: {
    flex: 1,
  },
  historyTask: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '600',
  },
  historyTime: {
    color: colors.textMuted,
    fontSize: normalizeFontSize(fontSizes.sm),
  },
  historyDuration: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
  },
});
