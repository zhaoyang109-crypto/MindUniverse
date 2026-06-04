import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { exercises } from '../data/exercises';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseList'>;

const CAT_LABELS: Record<string, { name: string; icon: string; color: string }> = {
  breathing: { name: '呼吸练习', icon: '🌬️', color: '#00CEC9' },
  body: { name: '身体扫描', icon: '🧘', color: '#A29BFE' },
  visualization: { name: '意象冥想', icon: '🏝️', color: '#FDCB6E' },
  meditation: { name: '正念冥想', icon: '💗', color: '#FD79A8' },
};

export default function ExerciseListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pressedId, setPressedId] = useState<string | null>(null);

  // 入场动画
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🧘 正念练习</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Intro */}
        <Animated.View style={[styles.introCard, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <View style={styles.introIconRow}>
            <Text style={styles.introEmoji}>✨</Text>
            <Text style={styles.introTitle}>给自己几分钟</Text>
          </View>
          <Text style={styles.introDesc}>
            这些练习可以帮助你放松身心、缓解焦虑、提升专注力。找一个安静的地方，戴上耳机效果更好。
          </Text>
        </Animated.View>

        {/* Exercise List */}
        {exercises.map((ex, idx) => {
          const cat = CAT_LABELS[ex.category];
          const isPressed = pressedId === ex.id;
          
          return (
            <TouchableOpacity
              key={ex.id}
              activeOpacity={0.8}
              onPressIn={() => setPressedId(ex.id)}
              onPressOut={() => {
                setPressedId(null);
                setTimeout(() => navigation.navigate('ExercisePlayer', { exerciseId: ex.id }), 120);
              }}
            >
              <Animated.View
                style={[
                  styles.exerciseCard,
                  { borderLeftWidth: 3, borderLeftColor: ex.color },
                  isPressed && [
                    styles.exerciseCardPressed,
                    { backgroundColor: ex.color + '08' },
                  ],
                  { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
                ]}
              >
                <View style={[styles.exIconBox, { backgroundColor: ex.color + '15' }]}>
                  <Text style={styles.exIcon}>{ex.icon}</Text>
                </View>
                
                <View style={styles.exInfo}>
                  <Text style={styles.exName}>{ex.title}</Text>
                  <Text style={styles.exDesc}>{ex.description}</Text>
                  <View style={styles.exMeta}>
                    <View style={[styles.metaPill, { backgroundColor: cat.color + '15' }]}>
                      <Text style={styles.metaText}>{cat.icon} {cat.name}</Text>
                    </View>
                    <View style={[styles.metaPill, { backgroundColor: theme.colors.background }]}>
                      <Text style={styles.metaText}>⏱️ {ex.duration}分钟</Text>
                    </View>
                    <View style={[styles.metaPill, { backgroundColor: theme.colors.background }]}>
                      <Text style={styles.metaText}>{ex.steps.length}步</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.goArrowBox, isPressed && { backgroundColor: ex.color + '15' }]}>
                  <Text style={[styles.goArrow, isPressed && { color: ex.color }]}>→</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}

        {/* Bottom Note */}
        <Animated.View style={[styles.noteCard, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>
            建议每天固定时间练习，坚持21天以上效果更明显。如果感到不适，请随时停止。
          </Text>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 0 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 18, color: theme.colors.text, fontWeight: '700', top: -1 },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: 'bold', color: theme.colors.text },

  introCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg, marginBottom: theme.spacing.lg,
    borderWidth: 1, borderColor: theme.colors.border + '40',
  },
  introIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  introEmoji: { fontSize: 24, marginRight: theme.spacing.sm },
  introTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },
  introDesc: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 22 },

  exerciseCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg, marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  exerciseCardPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 3,
  },
  exIconBox: {
    width: 50, height: 50, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
  },
  exIcon: { fontSize: 26 },
  exInfo: { flex: 1 },
  exName: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: 3 },
  exDesc: { fontSize: 11, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm + 2 },
  exMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  metaPill: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  metaText: { fontSize: 10, color: theme.colors.textSecondary },
  goArrowBox: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  goArrow: { fontSize: 18, color: theme.colors.textLight, fontWeight: '700' },

  noteCard: {
    flexDirection: 'row', marginTop: theme.spacing.md,
    backgroundColor: '#FDCB6E' + '08', borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, borderLeftWidth: 3, borderLeftColor: theme.colors.accent,
  },
  noteIcon: { fontSize: 18, marginRight: theme.spacing.sm },
  noteText: { flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 20 },
});
