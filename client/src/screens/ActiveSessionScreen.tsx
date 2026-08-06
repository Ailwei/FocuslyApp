import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Screen } from '@/components/UI';
import { colors, spacing, fontSizes, radius } from '@/theme/theme';
import { responsiveWidth, scale, verticalScale, normalizeFontSize } from '@/theme/responsive';
import { useFocus } from '@/context/FocusContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>;

const CIRCLE_SIZE = Math.min(responsiveWidth(72), 320);
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ActiveSessionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { task, durationMinutes } = route.params;
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const { addSession } = useFocus();                    // added hook call

  useEffect(() => {
  if (isPaused) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    return;
  }
  intervalRef.current = setInterval(() => {
    setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
  }, 1000);
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [isPaused]);

useEffect(() => {
  if (secondsLeft === 0) {
    navigation.replace('SessionComplete', { task, durationMinutes });
  }
}, [secondsLeft, navigation, task, durationMinutes]);

  const progress = secondsLeft / totalSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const endSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
    navigation.replace('SessionComplete', { task, durationMinutes: elapsedMinutes });
  };

  return (
    <Screen style={styles.center}>
      <Text style={styles.taskTitle}>{task}</Text>

      <View style={styles.timerWrap}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={colors.cardDark}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={colors.accent}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.timerTextWrap}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.pauseButton} onPress={() => setIsPaused((p) => !p)}>
          <Ionicons name={isPaused ? 'play' : 'pause'} size={18} color={colors.textPrimary} />
          <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endButton} onPress={endSession}>
          <Text style={[styles.buttonText, { color: colors.danger }]}>End session</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  taskTitle: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.lg),
    fontWeight: '700',
    marginTop: verticalScale(spacing.xl),
    marginBottom: verticalScale(spacing.xl),
  },
  timerWrap: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(spacing.xxl),
  },
  timerTextWrap: {
    position: 'absolute',
  },
  timerText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xxl),
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: scale(spacing.md),
    width: '100%',
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(spacing.sm),
    backgroundColor: colors.cardMid,
    borderRadius: radius.md,
    paddingVertical: verticalScale(spacing.md),
  },
  endButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardMid,
    borderRadius: radius.md,
    paddingVertical: verticalScale(spacing.md),
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
});
