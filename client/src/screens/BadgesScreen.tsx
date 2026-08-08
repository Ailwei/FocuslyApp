import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Screen, ScreenTitle } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { responsiveWidth, scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { Badge } from '@/types/models';
import { useBadges } from '@/context/BadgeContext';

const BadgeTile: React.FC<{ badge: Badge }> = ({ badge }) => (
  <Card
    variant={badge.unlocked ? 'dark' : 'mid'}
    style={[styles.badgeTile, badge.unlocked ? styles.badgeTileUnlocked : styles.badgeTileLocked]}
  >
    <View style={styles.badgeIconWrap}>
      <Ionicons
        name={badge.unlocked ? 'ribbon' : 'ribbon-outline'}
        size={20}
        color={badge.unlocked ? colors.gold : colors.textMuted}
      />
      {!badge.unlocked && (
        <Ionicons name="lock-closed" size={12} color={colors.textMuted} style={styles.lockIcon} />
      )}
    </View>
    <Text style={[styles.badgeText, badge.unlocked ? styles.badgeTextUnlocked : styles.badgeTextLocked]}>
      {badge.title}
    </Text>
  </Card>
);

export const BadgesScreen: React.FC = () => {
  const { badges, loading, error, refreshBadges } = useBadges();

  const unlockedCount = badges.filter((b: Badge) => b.unlocked).length;
console.log("badges unclocked", unlockedCount, badges)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const b of badges) {
      if (!seen.has(b.category)) {
        seen.add(b.category);
        ordered.push(b.category);
      }
    }
    return ordered;
  }, [badges]);

  const byCategory = (category: string) => badges.filter((b: Badge) => b.category === category);

  if (loading && badges.length === 0) {
    return (
      <Screen>
        <ScreenTitle>Badges</ScreenTitle>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </Screen>
    );
  }

  if (error && badges.length === 0) {
    return (
      <Screen>
        <ScreenTitle>Badges</ScreenTitle>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load badges.</Text>
          <Text style={styles.retryText} onPress={refreshBadges}>Tap to retry</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenTitle>Badges</ScreenTitle>
        <Text style={styles.subtitle}>{unlockedCount} of {badges.length} unlocked</Text>

        {categories.map((category) => (
          <View key={category}>
            <Text style={styles.sectionLabel}>{category}</Text>
            <View style={styles.grid}>
              {byCategory(category).map((b: Badge) => (
                <BadgeTile key={b.id} badge={b} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.md),
    marginBottom: verticalScale(spacing.lg),
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
    marginBottom: verticalScale(spacing.sm),
    marginTop: verticalScale(spacing.md),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  badgeTile: {
    width: '48%',
    marginBottom: verticalScale(spacing.md),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(96),
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
  badgeTextUnlocked: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  badgeTextLocked: {
    color: colors.textMuted,
    opacity: 0.9,
  },
  badgeTileUnlocked: {
    borderWidth: 1,
    borderColor: colors.goldLight,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  badgeTileLocked: {
    opacity: 0.9,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  badgeIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(spacing.sm),
  },
  lockIcon: {
    position: 'absolute',
    right: scale(8),
    top: verticalScale(8),
    backgroundColor: 'transparent',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(spacing.xl),
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.md),
    marginBottom: verticalScale(spacing.sm),
  },
  retryText: {
    color: colors.gold,
    fontSize: normalizeFontSize(fontSizes.sm),
    fontWeight: '700',
  },
});