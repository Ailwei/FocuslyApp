import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/UI';
import { colors, spacing, fontSizes } from '@/theme/theme';
import { useFocus } from '@/context/FocusContext';

interface Props {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  const { profile } = useFocus();

  return (
    <Screen>
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.member}>Member since {profile?.memberSince}</Text>

      <TouchableOpacity style={styles.row}>
        <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        <Text style={styles.rowText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
        <Text style={styles.rowText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={[styles.rowText, { color: colors.danger }]}>Log out</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  name: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    marginTop: spacing.xl,
  },
  member: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textMuted,
  },
  rowText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
