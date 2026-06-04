import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { categories } from '../data/categories';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AssessmentIntro'>;
type AssessmentRouteProp = RouteProp<RootStackParamList, 'AssessmentIntro'>;

export default function AssessmentIntroScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AssessmentRouteProp>();
  const { categoryId, subcategoryId } = route.params;

  const category = categories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories.find(s => s.id === subcategoryId);

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 按钮状态
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // 按钮按下动画
  const handlePressIn = (btnId: string) => {
    setPressedBtn(btnId);
    Animated.spring(scaleAnim, { toValue: 0.96, friction: 8, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    setPressedBtn(null);
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Header ====== */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>心理测试</Text>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* ====== 测试介绍卡片 ====== */}
        <Animated.View style={[
          styles.introCard,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
        ]}>
          <View style={[styles.iconCircle, { backgroundColor: (category?.color || theme.colors.primary) + '18' }]}>
            <Text style={styles.mainEmoji}>{category?.icon || '📊'}</Text>
          </View>
          
          <Text style={styles.title}>
            {subcategory?.name || category?.name || '心理健康'}测评
          </Text>
          
          <Text style={styles.description}>
            这份问卷将帮助你更深入地了解自己在「{category?.name} - {subcategory?.name}」方面的状态。
            {'\n\n'}请根据最近两周的真实感受作答，没有对错之分。
          </Text>

          {/* 信息标签 */}
          <View style={styles.infoRow}>
            <View style={styles.infoTag}>
              <Text style={styles.infoTagIcon}>📝</Text>
              <Text style={styles.infoTagText}>100 题</Text>
            </View>
            <View style={styles.infoTag}>
              <Text style={styles.infoTagIcon}>⏱️</Text>
              <Text style={styles.infoTagText}>约 15 分钟</Text>
            </View>
            <View style={styles.infoTag}>
              <Text style={styles.infoTagIcon}>🔒</Text>
              <Text style={styles.infoTagText}>隐私保护</Text>
            </View>
          </View>

          {/* 温馨提示 */}
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>中途可以随时退出，下次继续作答</Text>
          </View>
        </Animated.View>

        {/* ====== 操作按钮区域 ====== */}
        <Animated.View style={[
          styles.actionArea,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }] },
        ]}>
          <TouchableOpacity
            style={[styles.startBtn, pressedBtn === 'start' && styles.btnPressed]}
            onPressIn={() => handlePressIn('start')}
            onPressOut={() => {
              handlePressOut();
              setTimeout(() => {
                if (subcategoryId) {
                  navigation.navigate('Assessment', { assessmentId: subcategoryId, categoryId, subcategoryId });
                }
              }, 200);
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.startBtnText}>开始测试 →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.skipBtn, pressedBtn === 'skip' && styles.skipBtnPressed]}
            onPressIn={() => handlePressIn('skip')}
            onPressOut={() => {
              handlePressOut();
              setTimeout(() => {
                navigation.navigate('Chat', { category: categoryId, subcategory: subcategoryId });
              }, 150);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>跳过，直接咨询</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 18, color: theme.colors.text, fontWeight: '700', top: -1 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: theme.colors.text },

  introCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  mainEmoji: { fontSize: 30 },
  title: {
    fontSize: 20, fontWeight: 'bold', color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 13.5, color: theme.colors.textSecondary, lineHeight: 21,
    marginBottom: theme.spacing.lg,
  },

  infoRow: {
    flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg,
  },
  infoTag: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoTagIcon: { fontSize: 12, marginRight: 3 },
  infoTagText: { fontSize: 11, fontWeight: '600', color: theme.colors.textLight },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  tipIcon: { fontSize: 14, marginRight: theme.spacing.sm, top: 1 },
  tipText: { fontSize: 12, color: theme.colors.textSecondary, lineHeight: 17, flex: 1 },

  actionArea: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  startBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md + 4,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  startBtnText: {
    fontSize: 16, fontWeight: '700', color: '#FFF',
  },
  skipBtn: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  skipBtnPressed: { backgroundColor: theme.colors.border + '20' },
  skipBtnText: {
    fontSize: 13.5, fontWeight: '600', color: theme.colors.textLight,
  },
});
