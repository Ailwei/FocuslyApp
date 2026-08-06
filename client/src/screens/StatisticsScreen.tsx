import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Screen, ScreenTitle } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { useFocus } from '@/context/FocusContext';

export const StatisticsScreen: React.FC = () => {
  const { stats } = useFocus();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenTitle>Statistics</ScreenTitle>
        <View style={styles.statsGrid}>
          <Card variant="dark" style={styles.statTile}>
            <Ionicons name="flame" size={16} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Total sessions</Text>
          </Card>
          <Card variant="dark" style={styles.statTile}>
            <Ionicons name="time" size={16} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.statValue}>{Math.round(stats.totalFocusMinutes / 60)}h</Text>
            <Text style={styles.statLabel}>Total focus time</Text>
          </Card>
          <Card variant="dark" style={styles.statTile}>
            <Text style={styles.statValue}>{stats.averageSessionMinutes} min</Text>
            <Text style={styles.statLabel}>Average session</Text>
          </Card>
          <Card variant="dark" style={styles.statTile}>
            <Text style={styles.statValue}>{stats.longestSessionMinutes} min</Text>
            <Text style={styles.statLabel}>Longest session</Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statTile: {
    minWidth: '45%',
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});
