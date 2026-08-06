import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenTitle } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { useFocus } from '@/context/FocusContext';
import { FocusSession } from '@/types/models';

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long' });
}

function formatDuration(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60} hour${minutes > 60 ? 's' : ''}`;
  return `${minutes} min`;
}

export const HistoryScreen: React.FC = () => {
  const { sessions } = useFocus();

  const grouped = useMemo(() => {
    const map = new Map<string, FocusSession[]>();
    sessions.forEach((s) => {
      const label = dayLabel(s.completedAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    });
    return Array.from(map.entries());
  }, [sessions]);

  return (
    <Screen>
      <ScreenTitle>History</ScreenTitle>
      <ScrollView showsVerticalScrollIndicator={false}>
        {grouped.map(([label, items]) => (
          <View key={label} style={styles.group}>
            <Text style={styles.dayLabel}>{label}</Text>
            {items.map((session) => (
              <View key={session.id} style={styles.row}>
                <Ionicons name="checkbox-outline" size={22} color={colors.textPrimary} />
                <Text style={styles.taskText}>{session.task}</Text>
                <Text style={styles.durationText}>{formatDuration(session.durationMinutes)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: spacing.lg,
  },
  dayLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  taskText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  divider: {
    height: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.4,
    marginTop: spacing.sm,
  },
});
