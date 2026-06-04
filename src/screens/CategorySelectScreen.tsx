import React, { useState, useRef, useEffect } from 'react';
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
import { categories } from '../data/categories';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategorySelect'>;
const { width: SCREEN_W } = Dimensions.get('window');

export default function CategorySelectScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // 动画值
  const subHeightAnim = useRef(new Animated.Value(0)).current;
  const subOpacityAnim = useRef(new Animated.Value(0)).current;

  const activeCat = categories[selectedIndex ?? 0];
  const isActive = selectedIndex !== null;

  // 选择一级分类
  const selectCategory = (index: number) => {
    if (selectedIndex === index) return;

    if (selectedIndex !== null && selectedIndex !== index) {
      Animated.parallel([
        Animated.timing(subHeightAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
        Animated.timing(subOpacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }

    setSelectedIndex(index);
    setSelectedSub(null);

    Animated.parallel([
      Animated.timing(subHeightAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(subOpacityAnim, { toValue: 1, duration: 250, delay: 100, useNativeDriver: true }),
    ]).start();
  };

  // 选择细分方向
  const selectSub = (subId: string) => {
    setSelectedSub(subId);
    setTimeout(() => {
      navigation.navigate('AssessmentIntro', {
        categoryId: activeCat.id,
        subcategoryId: subId,
      });
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Header ====== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择方向</Text>
        <TouchableOpacity
          style={[styles.skipAllBtn, isActive && styles.skipAllBtnActive]}
          onPress={() => navigation.navigate('Chat', { category: undefined, subcategory: undefined })}
          activeOpacity={0.7}
        >
          <Text style={styles.skipAllText}>跳过 →</Text>
        </TouchableOpacity>
      </View>

      {/* ====== 一级分类 2×2 网格 ====== */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.catGridContainer}>
        <View style={styles.catGrid}>
          {categories.map((cat, idx) => {
            const isSel = selectedIndex === idx;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() => selectCategory(idx)}
              >
                <Animated.View
                  style={[
                    styles.catCard,
                    isSel && [
                      styles.catCardSelected,
                      { borderColor: cat.color, backgroundColor: cat.color + '10' },
                    ],
                  ]}
                >
                  {/* 左侧色条 */}
                  <View style={[styles.catLeftBar, { backgroundColor: isSel ? cat.color : cat.color + '40' }]} />

                  <View style={styles.catContent}>
                    <Text style={[styles.catEmoji, isSel && styles.catEmojiSel]}>{cat.icon}</Text>
                    <Text style={[styles.catName, isSel && { color: cat.color }]}>{cat.name}</Text>
                    <Text style={styles.catDesc} numberOfLines={2}>{cat.description}</Text>

                    <View style={styles.catFooter}>
                      <View style={[styles.catBadge, isSel && { backgroundColor: cat.color + '20' }]}>
                        <Text style={[styles.catBadgeText, isSel && { color: cat.color }]}>
                          {cat.subcategories.length} 个方向
                        </Text>
                      </View>

                      {isSel && (
                        <View style={[styles.selCheck, { backgroundColor: cat.color }]}>
                          <Text style={styles.selCheckIcon}>✓</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ====== 二级细分区域（带展开动画） ====== */}
        <Animated.View
          style={[
            styles.subArea,
            {
              height: subHeightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 260],
                extrapolate: 'clamp',
              }),
              opacity: subOpacityAnim,
            },
          ]}
        >
          {/* 分隔标题行 */}
          <View style={styles.subHeader}>
            <View style={[styles.subDot, { backgroundColor: activeCat.color }]} />
            <Text style={styles.subTitle}>
              {activeCat.icon} {activeCat.name}
            </Text>
            <Text style={styles.subHint}>点击选择具体方向</Text>
          </View>

          {/* 2×2 细分网格 */}
          <View style={styles.subGrid}>
            {activeCat.subcategories.map((sub) => {
              const isSel = selectedSub === sub.id;
              return (
                <TouchableOpacity
                  key={sub.id}
                  activeOpacity={0.85}
                  onPress={() => selectSub(sub.id)}
                >
                  <View style={[
                    styles.subCard,
                    isSel && [
                      styles.subCardSel,
                      {
                        backgroundColor: activeCat.color + '12',
                        borderColor: activeCat.color,
                      },
                    ],
                  ]}>
                    <Text style={[styles.subEmoji, isSel && { transform: [{ scale: 1.1 }] }]}>{sub.icon}</Text>

                    <Text style={[styles.subName, isSel && { color: activeCat.color }]}>{sub.name}</Text>
                    <Text style={[styles.subDesc, isSel && { opacity: 0.7 }]} numberOfLines={2}>
                      {sub.description}
                    </Text>

                    {isSel && (
                      <View style={[styles.selCheckSmall, { backgroundColor: activeCat.color }]}>
                        <Text style={styles.selCheckIconSmall}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* 底部留白 */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (SCREEN_W - theme.spacing.lg * 2 - theme.spacing.md) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm + 2,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 20, color: theme.colors.text, fontWeight: '700', top: -1 },
  headerTitle: { fontSize: theme.fontSize.lg, fontWeight: 'bold', color: theme.colors.text },
  skipAllBtn: {
    paddingHorizontal: theme.spacing.md, paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1, borderColor: theme.colors.border + '40',
  },
  skipAllBtnActive: { backgroundColor: theme.colors.primary + '15' },
  skipAllText: { fontSize: 12, fontWeight: '600', color: theme.colors.primaryLight },

  // Category Grid Container
  catGridContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 4,
  },

  // Category Grid (2 columns)
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },

  // Category Card
  catCard: {
    width: CARD_W,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  catCardSelected: {
    borderWidth: 1.5,
    elevation: 5,
  },
  catLeftBar: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: 4,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
  },
  catContent: {
    padding: theme.spacing.md,
    paddingLeft: theme.spacing.md + 8,
  },
  catEmoji: { fontSize: 26, marginBottom: 4 },
  catEmojiSel: { transform: [{ scale: 1.12 }] },
  catName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 3 },
  catDesc: { fontSize: 11, color: theme.colors.textSecondary, lineHeight: 15, marginTop: 2 },
  catFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10,
  },
  catBadge: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  catBadgeText: { fontSize: 10, fontWeight: '600', color: theme.colors.textLight },
  selCheck: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  selCheckIcon: { fontSize: 11, color: '#FFF', fontWeight: 'bold', top: -0.5 },

  // Sub Area
  subArea: {
    marginTop: theme.spacing.lg,
    overflow: 'hidden',
  },
  subHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  subDot: { width: 7, height: 7, borderRadius: 4, marginRight: 7 },
  subTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text },
  subHint: { fontSize: 11, color: theme.colors.textLight, marginLeft: 'auto' },

  // Sub Grid (2 columns)
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },

  subCard: {
    width: CARD_W,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm + 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  subCardSel: {
    borderWidth: 1.5,
    elevation: 4,
  },
  subEmoji: { fontSize: 22, marginBottom: 4 },
  subName: { fontSize: 13.5, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  subDesc: { fontSize: 10, color: theme.colors.textLight, lineHeight: 14 },
  selCheckSmall: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  selCheckIconSmall: { fontSize: 12, color: '#FFF', fontWeight: 'bold', top: -0.5 },
});
