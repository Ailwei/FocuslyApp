import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/UI';
import { FocusSession } from '@/types/models';
import { colors, spacing, fontSizes } from '@/theme/theme';
import {
  normalizeFontSize,
  scale,
  verticalScale,
} from '@/theme/responsive';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

interface RecentSessionsProps {
  sessions: FocusSession[];
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  sessions,
}) => {
  // Re-render every 60 seconds so relative times stay current.
  const [, forceTick] = React.useReducer((n) => n + 1, 0);

  React.useEffect(() => {
    const interval = setInterval(() => forceTick(), 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="mid" style={styles.container}>
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="time-outline"
            size={scale(28)}
            color={colors.textMuted}
          />

          <Text style={styles.emptyTitle}>
            No sessions yet
          </Text>

          <Text style={styles.emptySubtitle}>
            Your completed focus sessions will show up here
          </Text>
        </View>
      ) : (
        <View>
          {sessions.map((session) => (
            <View
              key={session.id}
              style={styles.historyRow}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={scale(20)}
                color={colors.textPrimary}
              />

              <View style={styles.historyTextWrap}>
                <Text style={styles.historyTask}>
                  {session.task}
                </Text>

                <Text style={styles.historyTime}>
                  {relativeTime(session.completedAt)}
                </Text>
              </View>

              <Text style={styles.historyDuration}>
                {session.durationMinutes}m
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: verticalScale(220),
    paddingVertical: verticalScale(spacing.sm),
    paddingHorizontal: scale(spacing.sm),
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(spacing.xs),
    paddingVertical: verticalScale(spacing.xl),
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },

  emptySubtitle: {
    color: colors.textMuted,
    fontSize: normalizeFontSize(fontSizes.sm),
    textAlign: 'center',
    maxWidth: scale(220),
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