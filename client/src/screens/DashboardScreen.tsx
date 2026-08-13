import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { Card, Screen } from '@/components/UI';
import { RecentSessions } from '@/components/RecentSessions';
import { colors, spacing, fontSizes } from '@/theme/theme';
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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { profile, sessions, stats } = useFocus();

  const { badges } = useBadges();

  const unlockedBadges = badges.filter(
    (badge: { unlocked: any }) => badge.unlocked
  );

  const latestBadge =
    unlockedBadges.length > 0
      ? [...unlockedBadges].sort(
          (a, b) =>
            new Date(b.unlockedAt ?? 0).getTime() -
            new Date(a.unlockedAt ?? 0).getTime()
        )[0]
      : null;

  const todayMinutes = sessions
    .filter(
      (s) =>
        new Date(s.completedAt).toDateString() ===
        new Date().toDateString()
    )
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>
          Welcome Back, {profile?.name}
        </Text>

        <Text style={styles.subtitle}>
          Ready for next focus session?
        </Text>

        <View style={styles.row}>
          <Card variant="mid" style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />

              <Text style={styles.statLabel}>
                Today
              </Text>
            </View>

            <Text style={styles.statValue}>
              {formatMinutes(todayMinutes)}
            </Text>
          </Card>

          <Card variant="mid" style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons
                name="flame-outline"
                size={16}
                color={colors.textSecondary}
              />

              <Text style={styles.statLabel}>
                Sessions
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalSessions}
            </Text>
          </Card>
        </View>

        <Card
          variant="mid"
          style={styles.newSessionCard}
        >
          <Ionicons
            name="play-circle"
            size={22}
            color={colors.accent}
          />

          <Text
            style={styles.newSessionText}
            onPress={() =>
              navigation.navigate('NewSession')
            }
          >
            New Focus session
          </Text>
        </Card>

        <Card
          variant="mid"
          style={styles.badgeSummaryCard}
        >
          <View style={styles.badgeSummaryContent}>
            <View style={styles.badgeInfo}>
              <Text style={styles.sectionLabel}>
                Badges
              </Text>

              <Text style={styles.badgeSummaryText}>
                {unlockedBadges.length} unlocked
              </Text>

              {latestBadge ? (
                <View style={styles.latestBadgeRow}>
                  <View style={styles.latestBadgeIconWrap}>
                    <Ionicons
                      name="ribbon"
                      size={16}
                      color={colors.accent}
                    />
                  </View>

                  <Text
                    style={styles.badgePreview}
                    numberOfLines={1}
                  >
                    {latestBadge.title}
                  </Text>
                </View>
              ) : (
                <Text style={styles.badgePreview}>
                  No badges yet
                </Text>
              )}
            </View>

            <Text
              style={styles.badgeCTA}
              onPress={() =>
                (navigation as any).navigate('Badges')
              }
            >
              More Badges
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>
          Recent
        </Text>

        <RecentSessions
          sessions={sessions.slice(0, 5)}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(spacing.xl),
  },

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

  badgeSummaryCard: {
    paddingVertical: verticalScale(spacing.md),
    paddingHorizontal: scale(spacing.md),
    marginBottom: verticalScale(spacing.md),
  },

  badgeSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  badgeInfo: {
    flex: 1,
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
    marginLeft: scale(spacing.md),
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.lg),
    fontWeight: '700',
    marginBottom: verticalScale(spacing.md),
  },

  latestBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(spacing.xs),
  },

  latestBadgeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(spacing.xs),
  },
});