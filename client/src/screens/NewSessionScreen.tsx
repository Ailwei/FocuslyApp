import React, { useState } from 'react';
import { NativeModules } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { PrimaryButton, ScreenTitle, Screen } from '@/components/UI';
import { colors, spacing, radius, fontSizes } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import * as Notifications from 'expo-notifications';

const { UsageStatsModule } = NativeModules;
const DURATIONS = [
  { label: '1 min', minutes: 1 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
];

export const NewSessionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [task, setTask] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMode, setCustomMode] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('30');

  const startSession = async () => {
    try {

       const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log('[Notifications] Permission denied');
      }
    }
      const hasAccess = await UsageStatsModule.hasUsageAccess();

      console.log('[UsageAccess] Granted:', hasAccess);

      if (!hasAccess) {
        console.log('[UsageAccess] Opening settings...');

        await UsageStatsModule.openUsageAccessSettings();

        return;
      }

      const minutes = customMode
        ? parseInt(customMinutes, 10) || 25
        : selectedMinutes;

      navigation.replace('ActiveSession', {
        task: task.trim() || 'Focus session',
        durationMinutes: minutes,
      });
    } catch (error) {
      console.error(
        '[UsageAccess] Failed:',
        error
      );
    }
  };

  return (
    <Screen>
      <ScreenTitle>New focus session</ScreenTitle>
      <Text style={styles.label}>What are you working on?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. C# Data Structures"
        placeholderTextColor={colors.textMuted}
        value={task}
        onChangeText={setTask}
      />

      <Text style={styles.label}>Duration</Text>
      <View style={styles.durationGrid}>
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d.minutes}
            style={[
              styles.durationButton,
              !customMode && selectedMinutes === d.minutes && styles.durationButtonActive,
            ]}
            onPress={() => {
              setCustomMode(false);
              setSelectedMinutes(d.minutes);
            }}
          >
            <Text
              style={[
                styles.durationText,
                !customMode && selectedMinutes === d.minutes && styles.durationTextActive,
              ]}
            >
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.durationButton, customMode && styles.durationButtonActive]}
          onPress={() => setCustomMode(true)}
        >
          <Text style={[styles.durationText, customMode && styles.durationTextActive]}>Custom</Text>
        </TouchableOpacity>
      </View>

      {customMode && (
        <TextInput
          style={[styles.input, { marginTop: spacing.sm }]}
          keyboardType="number-pad"
          placeholder="Minutes"
          placeholderTextColor={colors.textMuted}
          value={customMinutes}
          onChangeText={setCustomMinutes}
        />
      )}

      <PrimaryButton title="Start session" variant="primary" onPress={startSession} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.md),
    marginTop: verticalScale(spacing.lg),
    marginBottom: verticalScale(spacing.sm),
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.sm,
    paddingHorizontal: scale(spacing.md),
    paddingVertical: verticalScale(spacing.md),
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(spacing.md),
  },
  durationButton: {
    backgroundColor: colors.cardMid,
    borderRadius: radius.md,
    paddingVertical: verticalScale(spacing.lg),
    paddingHorizontal: scale(spacing.lg),
    minWidth: '45%',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: colors.accent,
  },
  durationText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '600',
  },
  durationTextActive: {
    color: colors.black,
    fontWeight: '800',
  },
});
