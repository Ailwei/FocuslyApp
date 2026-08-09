import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/types/models';
import { colors, spacing, fontSizes, radius } from '@/theme/theme';
import { scale, verticalScale, normalizeFontSize } from '@/theme/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BadgeUnlockModalProps {
  badges: Badge[];
}

const CONFETTI_COLORS = ['#7C5CFF', '#FF6B9D', '#FFD166', '#06D6A0', '#4CC9F0'];
const CONFETTI_COUNT = 24;
const BALLOON_COLORS = ['#FF6B9D', '#7C5CFF', '#06D6A0', '#FFD166'];
const BALLOON_COUNT = 6;

interface ConfettiPieceProps {
  delay: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ delay }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const startX = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 120, []);
  const color = useMemo(
    () => CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    []
  );
  const size = useMemo(() => 6 + Math.random() * 6, []);
  const duration = useMemo(() => 2200 + Math.random() * 1200, []);
  const spins = useMemo(() => 2 + Math.random() * 3, []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 40,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: spins,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          delay: duration * 0.7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const rotateInterpolated = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 0,
        width: size,
        height: size * 1.6,
        backgroundColor: color,
        borderRadius: 2,
        opacity,
        transform: [
          { translateY },
          { translateX },
          { rotate: rotateInterpolated },
        ],
      }}
    />
  );
};

interface BalloonProps {
  delay: number;
  index: number;
}

const Balloon: React.FC<BalloonProps> = ({ delay, index }) => {
  const translateY = useRef(new Animated.Value(60)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const color = useMemo(
    () => BALLOON_COLORS[index % BALLOON_COLORS.length],
    [index]
  );
  const leftPercent = useMemo(
    () => 10 + (index * (80 / BALLOON_COUNT)) + (Math.random() * 6 - 3),
    [index]
  );
  const duration = useMemo(() => 3200 + Math.random() * 1000, []);
  const size = useMemo(() => 34 + Math.random() * 14, []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -(SCREEN_HEIGHT + 100),
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sway, {
              toValue: 1,
              duration: 700,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(sway, {
              toValue: -1,
              duration: 700,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          { iterations: 6 }
        ),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const swayInterpolated = sway.interpolate({
    inputRange: [-1, 1],
    outputRange: [-18, 18],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        bottom: 0,
        opacity,
        transform: [{ translateY }, { translateX: swayInterpolated }],
      }}
    >
      <View
        style={{
          width: size,
          height: size * 1.2,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          alignSelf: 'center',
          width: 1.5,
          height: 28,
          backgroundColor: colors.textSecondary,
          opacity: 0.6,
        }}
      />
    </Animated.View>
  );
};

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badges }) => {
  const [queue, setQueue] = useState<Badge[]>([]);
  const [effectKey, setEffectKey] = useState(0);

  useEffect(() => {
    if (badges.length > 0) {
      setQueue(badges);
      setEffectKey((k) => k + 1);
    }
  }, [badges]);

  if (queue.length === 0) return null;

  const current = queue[0];

  const handleDismiss = () => {
    setQueue((prev) => prev.slice(1));
    setEffectKey((k) => k + 1);
  };

  return (
    <Modal transparent animationType="fade" visible={queue.length > 0}>
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={StyleSheet.absoluteFill} pointerEvents="none" key={`fx-${effectKey}`}>
          {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
            <ConfettiPiece key={`c-${i}`} delay={i * 40} />
          ))}
          {Array.from({ length: BALLOON_COUNT }).map((_, i) => (
            <Balloon key={`b-${i}`} delay={i * 120} index={i} />
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="ribbon" size={48} color={colors.accent} />
          </View>

          <Text style={styles.eyebrow}>Badge unlocked</Text>
          <Text style={styles.title}>{current.title}</Text>

          {queue.length > 1 && (
            <Text style={styles.queueHint}>
              +{queue.length - 1} more badge{queue.length - 1 === 1 ? '' : 's'} unlocked
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleDismiss}>
            <Text style={styles.buttonText}>
              {queue.length > 1 ? 'Next' : 'Nice!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(spacing.xl),
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardDark,
    borderRadius: radius.lg,
    paddingVertical: verticalScale(spacing.xl),
    paddingHorizontal: scale(spacing.xl),
    alignItems: 'center',
    zIndex: 10,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.cardMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(spacing.lg),
  },
  eyebrow: {
    color: colors.accent,
    fontSize: normalizeFontSize(fontSizes.sm),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(4),
  },
  title: {
    color: colors.textPrimary,
    fontSize: normalizeFontSize(fontSizes.xl),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: verticalScale(spacing.sm),
  },
  queueHint: {
    color: colors.textSecondary,
    fontSize: normalizeFontSize(fontSizes.sm),
    marginBottom: verticalScale(spacing.lg),
  },
  button: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: verticalScale(spacing.md),
    alignItems: 'center',
    marginTop: verticalScale(spacing.md),
  },
  buttonText: {
    color: colors.background ?? '#000',
    fontSize: normalizeFontSize(fontSizes.md),
    fontWeight: '700',
  },
});