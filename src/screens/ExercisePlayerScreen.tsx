import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Dimensions, Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { exercises } from '../data/exercises';
import * as Speech from 'expo-speech';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExercisePlayer'>;
type Route = RouteProp<RootStackParamList, 'ExercisePlayer'>;

const { width: SCREEN_W } = Dimensions.get('window');

export default function ExercisePlayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Route>();
  const { exerciseId } = route.params;
  const exercise = exercises.find(e => e.id === exerciseId)!;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breathScaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(breathScaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
    return () => { Speech.stop(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // 呼吸动画（呼吸练习时）
  useEffect(() => {
    if (isPlaying && exercise.category === 'breathing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathScaleAnim, { toValue: 1.3, duration: 4000, useNativeDriver: true }),
          Animated.timing(breathScaleAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      breathScaleAnim.setValue(1);
    }
  }, [isPlaying, exercise.category]);

  // 播放时脉冲动画
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.85, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  // 进度动画
  useEffect(() => {
    const target = (currentStep / exercise.steps.length);
    Animated.spring(progressAnim, { toValue: target, friction: 8, tension: 40, useNativeDriver: false }).start();
  }, [currentStep]);

  const startStep = (idx: number) => {
    setCurrentStep(idx); setIsPlaying(true);
    const step = exercise.steps[idx];
    Speech.speak(step.instruction, { language: 'zh-CN', pitch: 0.9, rate: 0.78 });

    if (step.duration) {
      setTimeLeft(step.duration);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (idx < exercise.steps.length - 1) setTimeout(() => startStep(idx + 1), 500);
            else { setIsPlaying(false); setCurrentStep(exercise.steps.length - 1); }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (idx < exercise.steps.length - 1)
        setTimeout(() => startStep(idx + 1), step.duration || 3000);
      else setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!isPlaying) startStep(currentStep);
    else { setIsPlaying(false); Speech.stop(); if (timerRef.current) clearInterval(timerRef.current); }
  };

  const reset = () => {
    setIsPlaying(false); Speech.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentStep(0); setTimeLeft(0);
  };

  const isComplete = currentStep >= exercise.steps.length - 1 && !isPlaying;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Speech.stop(); navigation.goBack(); }} activeOpacity={0.7}>
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.title}</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
                backgroundColor: exercise.color,
              },
            ]}
          />
        </View>
        <View style={styles.progressDots}>
          {exercise.steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < currentStep && { backgroundColor: exercise.color },
                i === currentStep && [styles.dotActive, { backgroundColor: exercise.color }],
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressLabel}>{currentStep + 1} / {exercise.steps.length}</Text>
      </View>

      {/* Main Content Area */}
      <View style={[styles.mainArea, { backgroundColor: exercise.color + '06' }]}>
        {/* Before Start */}
        {!isPlaying && currentStep === 0 && (
          <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.bigIconBox, { backgroundColor: exercise.color + '12', transform: [{ scale: breathScaleAnim }] }]}>
              <Text style={styles.bigIcon}>{exercise.icon}</Text>
            </Animated.View>
            <Text style={styles.exName}>{exercise.title}</Text>
            <Text style={styles.exDuration}>⏱️ 约 {exercise.duration} 分钟</Text>
            <Text style={styles.exDesc}>{exercise.description}</Text>
            
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: exercise.color }]}
              onPress={() => startStep(0)}
              activeOpacity={0.85}
            >
              <Text style={styles.startBtnText}>开始练习 →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Playing */}
        {isPlaying && (
          <View style={styles.centerContent}>
            {exercise.category === 'breathing' ? (
              <Animated.View style={[
                styles.breathCircle,
                { borderColor: exercise.color + '40', transform: [{ scale: breathScaleAnim }] },
              ]}>
                <Animated.View style={[
                  styles.breathCircleInner,
                  { backgroundColor: exercise.color + '15', transform: [{ scale: breathScaleAnim }] },
                ]} />
              </Animated.View>
            ) : (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.playEmoji}>🧘</Text>
              </Animated.View>
            )}

            <Text style={styles.stepInstruction}>
              {exercise.steps[currentStep]?.instruction}
            </Text>

            {timeLeft > 0 && (
              <>
                <View style={[styles.timerRing, { borderColor: exercise.color + '30' }]}>
                  <Text style={[styles.timerNum, { color: exercise.color }]}>{timeLeft}</Text>
                </View>
                <Text style={styles.timerUnit}>秒</Text>
              </>
            )}
          </View>
        )}

        {/* Complete */}
        {isComplete && (
          <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
            <Text style={styles.completeEmoji}>🌟</Text>
            <Text style={styles.completeTitle}>练习完成</Text>
            <Text style={styles.completeDesc}>
              做得很好！你给自己留出了宝贵的宁静时刻。{'\n'}
              感受一下现在的状态，然后慢慢回到当下。
            </Text>
            <View style={styles.completeActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={reset} activeOpacity={0.7}>
                <Text style={styles.secondaryBtnText}>再来一次</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: exercise.color }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>完成</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Control Bar */}
      {(isPlaying || currentStep > 0) && !isComplete && (
        <View style={styles.controlBar}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={reset} activeOpacity={0.7}>
            <Text style={styles.ctrlText}>↺ 重来</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: exercise.color }]}
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            <Text style={styles.playBtnIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctrlBtn}
            onPress={() => { Speech.stop(); if (timerRef.current) clearInterval(timerRef.current); setIsPlaying(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.ctrlText}>⏹ 停止</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  headerTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },

  progressArea: {
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm,
  },
  progressTrack: {
    height: 4, backgroundColor: theme.colors.border + '30',
    borderRadius: 2, overflow: 'hidden', marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%', borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.border + '60' },
  dotActive: { transform: [{ scale: 1.4 }] },
  progressLabel: { fontSize: 10, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 6 },

  mainArea: {
    flex: 1, margin: theme.spacing.lg, borderRadius: theme.borderRadius.xxl,
    alignItems: 'center', justifyContent: 'center',
  },
  centerContent: { alignItems: 'center', paddingHorizontal: theme.spacing.xl },

  // Before Start
  bigIconBox: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg,
  },
  bigIcon: { fontSize: 42 },
  exName: { fontSize: theme.fontSize.xxl, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.xs },
  exDuration: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  exDesc: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: theme.spacing.xl },
  startBtn: {
    paddingHorizontal: theme.spacing.xxxl, paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full, ...theme.shadows.md,
  },
  startBtnText: { fontSize: theme.fontSize.lg, fontWeight: '700', color: '#FFF' },

  // Playing
  playEmoji: { fontSize: 52, marginBottom: theme.spacing.lg },
  stepInstruction: {
    fontSize: theme.fontSize.lg, color: theme.colors.text, textAlign: 'center',
    lineHeight: 28, marginBottom: theme.spacing.xl, fontWeight: '600',
  },
  breathCircle: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  breathCircleInner: {
    width: 80, height: 80, borderRadius: 40,
  },
  timerRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.md,
  },
  timerNum: { fontSize: 34, fontWeight: 'bold' },
  timerUnit: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: 4 },

  // Complete
  completeEmoji: { fontSize: 56, marginBottom: theme.spacing.md },
  completeTitle: { fontSize: theme.fontSize.xxl, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.sm },
  completeDesc: {
    fontSize: theme.fontSize.sm, color: theme.colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: theme.spacing.xl,
  },
  completeActions: { flexDirection: 'row', gap: theme.spacing.md },
  secondaryBtn: {
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  secondaryBtnText: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.text },
  primaryBtn: {
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  primaryBtnText: { fontSize: theme.fontSize.sm, fontWeight: '600', color: '#FFF' },

  // Controls
  controlBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.colors.border + '30',
  },
  ctrlBtn: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  ctrlText: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, fontWeight: '600' },
  playBtn: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center', ...theme.shadows.md,
  },
  playBtnIcon: { fontSize: 24, color: '#FFF' },
});
