import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width: SCREEN_W } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const heroScaleAnim = useRef(new Animated.Value(1)).current;

  // 按钮按下动画
  const [pressedTool, setPressedTool] = useState<string | null>(null);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
    
    // Hero 区域呼吸动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroScaleAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(heroScaleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // 工具按钮带动画的导航
  const handleToolPress = (screen: keyof RootStackParamList, toolId: string) => {
    setPressedTool(toolId);
    setTimeout(() => {
      setPressedTool(null);
      navigation.navigate(screen as never);
    }, 150);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Header ====== */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <View>
            <Text style={styles.greeting}>你好 ✨</Text>
            <Text style={styles.subtitle}>在宇宙中，你是唯一的</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Journal' as never)}
          >
            <View style={styles.avatarRing}>
              <Animated.View style={[styles.avatarInner, { transform: [{ scale: heroScaleAnim }] }]}>
                <Text style={styles.avatarEmoji}>🌌</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ====== Hero Card - 开始咨询 ====== */}
        <Animated.View style={[
          styles.heroCard,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }, { scale: heroScaleAnim }] },
        ]}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>开始你的探索</Text>
              <Text style={styles.heroDesc}>选择方向，开启心灵之旅</Text>
              <TouchableOpacity
                style={styles.heroBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CategorySelect')}
              >
                <Text style={styles.heroBtnText}>开始咨询 →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.heroEmoji}>🧘</Text>
          </View>

          {/* 装饰性背景元素 */}
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
        </Animated.View>

        {/* ====== 工具网格 ====== */}
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
        ]}>
          <Text style={styles.sectionTitle}>工具箱</Text>
          
          <View style={styles.toolsGrid}>
            {[
              { id: 'chat', icon: '💬', label: '随便聊聊', screen: 'Chat', color: '#5B8DEF' },
              { id: 'journal', icon: '📝', label: '心情日记', screen: 'Journal', color: '#FF7EB3' },
              { id: 'exercise', icon: '🎵', label: '冥想练习', screen: 'ExerciseList', color: '#34D399' },
              { id: 'test', icon: '📊', label: '心理测试', screen: 'AssessmentIntro', color: '#818CF8' },
            ].map((tool) => (
              <TouchableOpacity
                key={tool.id}
                activeOpacity={0.85}
                onPressIn={() => setPressedTool(tool.id)}
                onPressOut={() => handleToolPress(tool.screen as keyof RootStackParamList, tool.id)}
              >
                <Animated.View style={[
                  styles.toolCard,
                  pressedTool === tool.id && [
                    styles.toolCardPressed,
                    { borderColor: tool.color + '60' },
                  ],
                ]}>
                  <View style={[styles.toolIconBg, { backgroundColor: tool.color + '18' }]}>
                    <Text style={styles.toolIcon}>{tool.icon}</Text>
                  </View>
                  <Text style={styles.toolLabel}>{tool.label}</Text>
                  {pressedTool === tool.id && (
                    <View style={[styles.toolRipple, { backgroundColor: tool.color + '15' }]} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ====== 心理盲盒入口 ====== */}
        <Animated.View style={[
          styles.blindBoxEntry,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
        ]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BlindBox')}
          >
            <View style={styles.blindBoxCard}>
              <View style={styles.blindBoxLeft}>
                <Text style={styles.blindBoxTitle}>🎁 心理盲盒</Text>
                <Text style={styles.blindBoxDesc}>每天5个盲盒，发现心理学小知识</Text>
                <View style={styles.blindBoxTag}>
                  <Text style={styles.blindBoxTagText}>点击探索 →</Text>
                </View>
              </View>
              <View style={styles.blindBoxRight}>
                <Animated.View style={{ transform: [{ scale: heroScaleAnim }] }}>
                  <Text style={styles.blindBoxEmoji}>🎁</Text>
                </Animated.View>
              </View>
              <View style={styles.blindBoxDecor1} />
              <View style={styles.blindBoxDecor2} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ====== 今日引言 ====== */}
        <Animated.View style={[
          styles.quoteSection,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
        ]}>
          <View style={styles.quoteMark}>
            <Text style={styles.quoteMarkText}>"</Text>
          </View>
          <Text style={styles.quoteText}>
            接纳自己，是改变的开始。每一个情绪都值得被看见。
          </Text>
          <Text style={styles.quoteAuthor}>— 心理学智慧</Text>
        </Animated.View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },

  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: theme.colors.primary + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },

  // Hero Card
  heroCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: { flex: 1 },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: theme.spacing.md,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.full,
  },
  heroBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  heroEmoji: { fontSize: 48 },
  heroDecor1: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -15,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Section
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  // Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  toolCard: {
    width: (SCREEN_W - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  toolCardPressed: {
    transform: [{ scale: 0.97 }],
    elevation: 3,
  },
  toolIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  toolIcon: { fontSize: 22 },
  toolLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.colors.text,
  },
  toolRipple: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: theme.borderRadius.lg,
  },

  // Blind Box Entry
  blindBoxEntry: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  blindBoxCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFC94D',
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.lg,
  },
  blindBoxLeft: {
    flex: 1,
  },
  blindBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
  },
  blindBoxDesc: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: theme.spacing.md,
  },
  blindBoxTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(120,53,15,0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  blindBoxTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
  },
  blindBoxRight: {
    marginLeft: theme.spacing.md,
  },
  blindBoxEmoji: {
    fontSize: 48,
  },
  blindBoxDecor1: {
    position: 'absolute',
    top: -15,
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  blindBoxDecor2: {
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Quote Section
  quoteSection: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  quoteMark: {
    marginBottom: theme.spacing.sm,
  },
  quoteMarkText: {
    fontSize: 36,
    color: theme.colors.primary,
    lineHeight: 36,
    fontFamily: 'Georgia',
  },
  quoteText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 11,
    color: theme.colors.textLight,
    textAlign: 'right',
    marginTop: theme.spacing.sm,
  },
});
