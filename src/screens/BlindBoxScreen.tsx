import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { blindBoxData, BlindBoxItem } from '../data/blindBoxes';
import { theme } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const DAILY_LIMIT = 5;
const STORAGE_KEY = '@mind_universe_blindbox';

interface DailyRecord {
  date: string;
  openedIds: string[];
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function BlindBoxScreen() {
  const [dailyRecord, setDailyRecord] = useState<DailyRecord>({ date: '', openedIds: [] });
  const [currentItem, setCurrentItem] = useState<BlindBoxItem | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Animations
  const flipAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadDailyRecord();
    // Pulse animation for the box
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const loadDailyRecord = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const record: DailyRecord = JSON.parse(stored);
        if (record.date === getTodayStr()) {
          setDailyRecord(record);
        } else {
          // New day, reset
          const newRecord: DailyRecord = { date: getTodayStr(), openedIds: [] };
          setDailyRecord(newRecord);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecord));
        }
      } else {
        const newRecord: DailyRecord = { date: getTodayStr(), openedIds: [] };
        setDailyRecord(newRecord);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecord));
      }
    } catch {
      const newRecord: DailyRecord = { date: getTodayStr(), openedIds: [] };
      setDailyRecord(newRecord);
    }
  };

  const remainingCount = DAILY_LIMIT - dailyRecord.openedIds.length;
  const canOpen = remainingCount > 0;

  const handleOpenBox = () => {
    if (!canOpen) {
      Alert.alert('今日次数已用完', '每天最多开启5个心理盲盒，明天再来吧！☀️');
      return;
    }

    setIsOpening(true);
    setIsRevealed(false);

    // Get a random unopened item
    const openedSet = new Set(dailyRecord.openedIds);
    const availableItems = blindBoxData.filter(item => !openedSet.has(item.id));
    
    if (availableItems.length === 0) {
      Alert.alert('太厉害了！', '你已经打开了所有盲盒！🎉');
      setIsOpening(false);
      return;
    }

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    setCurrentItem(randomItem);

    // Flip animation
    flipAnim.setValue(0);
    Animated.sequence([
      // Close/flip the box
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Brief pause
      Animated.delay(200),
    ]).start(() => {
      setIsRevealed(true);
      // Fade in the content
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]).start();

      // Sparkle animation
      sparkleAnim.setValue(0);
      Animated.timing(sparkleAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

      // Save to daily record
      const newRecord: DailyRecord = {
        date: getTodayStr(),
        openedIds: [...dailyRecord.openedIds, randomItem.id],
      };
      setDailyRecord(newRecord);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecord));
      setIsOpening(false);
    });
  };

  const handleClose = () => {
    setIsRevealed(false);
    setCurrentItem(null);
    flipAnim.setValue(0);
  };

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎁 心理盲盒</Text>
          <Text style={styles.headerSubtitle}>每天发现一点心理学小知识</Text>
        </View>

        {/* Daily counter */}
        <View style={styles.counterCard}>
          <View style={styles.counterRow}>
            {[...Array(DAILY_LIMIT)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.counterDot,
                  i < dailyRecord.openedIds.length
                    ? styles.counterDotFilled
                    : styles.counterDotEmpty,
                ]}
              >
                {i < dailyRecord.openedIds.length && (
                  <Text style={styles.counterDotCheck}>✓</Text>
                )}
              </View>
            ))}
          </View>
          <Text style={styles.counterText}>
            今日剩余 <Text style={styles.counterNum}>{remainingCount}</Text> / {DAILY_LIMIT} 次
          </Text>
        </View>

        {/* Blind Box Area */}
        {!isRevealed ? (
          <View style={styles.boxArea}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.blindBox, !canOpen && styles.blindBoxDisabled]}
                activeOpacity={0.85}
                onPress={handleOpenBox}
                disabled={isOpening || !canOpen}
              >
                <Text style={styles.blindBoxEmoji}>
                  {isOpening ? '🌀' : '🎁'}
                </Text>
                <Text style={styles.blindBoxLabel}>
                  {isOpening ? '开启中...' : canOpen ? '点击开启' : '今日已开完'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.boxHint}>
              每个盲盒藏着一个心理学知识或自我疏导方法
            </Text>
          </View>
        ) : (
          <Animated.View style={[
            styles.revealCard,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}>
            {/* Sparkle decoration */}
            <Animated.View style={[
              styles.sparkle,
              { opacity: sparkleAnim },
            ]}>
              <Text style={styles.sparkleText}>✨</Text>
            </Animated.View>

            <View style={styles.revealCategory}>
              <Text style={styles.revealEmoji}>{currentItem?.emoji}</Text>
              <Text style={styles.revealCategoryText}>{currentItem?.categoryTitle}</Text>
            </View>

            <Text style={styles.revealQuestion}>{currentItem?.question}</Text>

            <View style={styles.revealDivider} />

            <Text style={styles.revealAnswer}>{currentItem?.answer}</Text>

            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>继续探索 🎁</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Today's opened items history */}
        {dailyRecord.openedIds.length > 0 && !isRevealed && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>今日已开盲盒</Text>
            {dailyRecord.openedIds.slice(-3).map((id) => {
              const item = blindBoxData.find(b => b.id === id);
              if (!item) return null;
              return (
                <View key={id} style={styles.historyItem}>
                  <Text style={styles.historyItemEmoji}>{item.emoji}</Text>
                  <Text style={styles.historyItemQ} numberOfLines={1}>{item.question}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Info section */}
        {!isRevealed && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 关于心理盲盒</Text>
            <Text style={styles.infoText}>
              每个盲盒都藏着一条心理学知识或自我疏导的方法。每天可以开启5个，让心理学的小智慧慢慢融入你的生活。
            </Text>
            <Text style={styles.infoText}>
              共有2000个盲盒等你探索，涵盖自我关怀、情绪调节、人际关系、成长思维、趣味心理、压力释放、自信培养、睡眠健康等8大方向。
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  // Counter
  counterCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  counterRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  counterDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDotFilled: {
    backgroundColor: theme.colors.primary,
  },
  counterDotEmpty: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  counterDotCheck: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  counterNum: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.fontSize.md,
  },

  // Box Area
  boxArea: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  blindBox: {
    width: 180,
    height: 180,
    borderRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  blindBoxDisabled: {
    backgroundColor: theme.colors.surfaceLight,
  },
  blindBoxEmoji: {
    fontSize: 56,
    marginBottom: theme.spacing.sm,
  },
  blindBoxLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: '#FFF',
  },
  boxHint: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },

  // Reveal Card
  revealCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.accent + '40',
    ...theme.shadows.md,
  },
  sparkle: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  sparkleText: {
    fontSize: 28,
  },
  revealCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surfaceLight,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  revealEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  revealCategoryText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  revealQuestion: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: theme.spacing.md,
  },
  revealDivider: {
    height: 2,
    backgroundColor: theme.colors.accent + '30',
    borderRadius: 1,
    marginBottom: theme.spacing.md,
  },
  revealAnswer: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  closeBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },

  // History
  historySection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  historyTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyItemEmoji: {
    fontSize: 18,
    marginRight: theme.spacing.md,
  },
  historyItemQ: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  // Info
  infoCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
});
