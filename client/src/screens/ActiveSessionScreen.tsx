import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Screen } from '@/components/UI';
import { colors, spacing, fontSizes, radius } from '@/theme/theme';
import {
  responsiveWidth,
  scale,
  verticalScale,
  normalizeFontSize,
} from '@/theme/responsive';
import { useFocus } from '@/context/FocusContext';
import { useDistractionDetector } from '@/hooks/useDistractionDetector';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>;

const CIRCLE_SIZE = Math.min(responsiveWidth(72), 320);
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const m = Math.floor(safeSeconds / 60);
  const s = safeSeconds % 60;

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ActiveSessionScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { task, durationMinutes } = route.params;

  const {
    activeSession,
    startSession,
    pauseSession,
    resumeSession,
    cancelSession,
    recordDistraction,
  } = useFocus();

  const { distractions } = useDistractionDetector({
    isActive: !!activeSession && !activeSession.isPaused,
    onDistraction: recordDistraction,
  });

  const hasStartedRef = React.useRef(false);
  const startedSessionAtRef = React.useRef<string | null>(null);
  const completionHandledRef = React.useRef(false);

  useEffect(() => {
    let cancelled = false;

    const beginSession = async () => {
      if (hasStartedRef.current) return;

      hasStartedRef.current = true;

      try {
        const startedAt = await startSession(task, durationMinutes);

        if (!cancelled) {
          startedSessionAtRef.current = startedAt;
        }
      } catch (error) {
        console.error('[Focus] Failed to start session:', error);
        hasStartedRef.current = false;
      }
    };

    beginSession();

    return () => {
      cancelled = true;
    };
  }, [task, durationMinutes, startSession]);

  useEffect(() => {
  if (!activeSession) return;

  if (!startedSessionAtRef.current) return;

  if (activeSession.startedAt !== startedSessionAtRef.current) {
    return;
  }

  if (
    activeSession.status === 'completed' &&
    !completionHandledRef.current
  ) {
    completionHandledRef.current = true;

    console.log('[Focus] Current session completed — navigating');

    navigation.replace('SessionComplete', {
      task: activeSession.task,
      durationMinutes: activeSession.durationMinutes,
      distractions,
      sessionStartedAt: activeSession.startedAt,
    });
  }
}, [activeSession, distractions, navigation]);

  if (!activeSession) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.taskTitle}>Starting…</Text>
      </Screen>
    );
  }

  const {
    remainingSeconds,
    totalSeconds,
    isPaused,
  } = activeSession;

  const progress =
    totalSeconds > 0
      ? remainingSeconds / totalSeconds
      : 0;

  const strokeDashoffset =
    CIRCUMFERENCE * (1 - progress);

  const handleEndSession = async () => {
    const result = await cancelSession();

    if (result) {
      navigation.replace('SessionComplete', {
        task: result.task,
        durationMinutes: result.elapsedMinutes,
        distractions,
        sessionStartedAt: result.startedAt,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Screen style={styles.center}>
      <Text style={styles.taskTitle}>
        {activeSession.task}
      </Text>

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
          <Text style={styles.timerText}>
            {formatTime(remainingSeconds)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={
            isPaused
              ? resumeSession
              : pauseSession
          }
        >
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={18}
            color={colors.textPrimary}
          />

          <Text style={styles.buttonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndSession}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.danger },
            ]}
          >
            End session
          </Text>
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