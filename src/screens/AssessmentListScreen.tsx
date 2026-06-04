import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { subcategoryAssessments } from '../data/subcategoryAssessments';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AssessmentList'>;

export default function AssessmentListScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📋 心理测评中心</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introTitle}>科学评估，了解自己</Text>
          <Text style={styles.introDesc}>
            每个方向都有完整的 100 道专业题目，帮助你全面了解自己的心理状态。
            测试结果仅供参考，不能替代专业诊断。
          </Text>
        </View>

        {/* Assessment Cards */}
        {subcategoryAssessments.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={[styles.card, { borderLeftColor: a.interpretation[2]?.color || theme.colors.primary }]}
            onPress={() =>
              navigation.navigate('Assessment', {
                assessmentId: a.id,
                categoryId: '',
                subcategoryId: '',
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardIconBox}>
                <Text style={styles.cardIcon}>📊</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{a.title}</Text>
                <Text style={styles.cardDesc}>{a.description}</Text>
              </View>
              <Text style={styles.cardGo}>→</Text>
            </View>

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📝</Text>
                <Text style={styles.metaText}>{a.questions.length} 题</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaText}>~{Math.ceil(a.questions.length * 1.2 / 60)}分钟</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📈</Text>
                <Text style={styles.metaText}>{a.scoring.max}{a.scoring.unit}</Text>
              </View>
            </View>

            {/* Level pills */}
            <View style={styles.levelsRow}>
              {a.interpretation.map((interp, i) => (
                <View key={i} style={[styles.levelPill, { backgroundColor: interp.color + '15' }]}>
                  <View style={[styles.levelDot, { backgroundColor: interp.color }]} />
                  <Text style={styles.levelLabel}>{interp.level}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>⚠️</Text>
          <View style={styles.disclaimerBody}>
            <Text style={styles.disclaimerTitle}>温馨提示</Text>
            <Text style={styles.disclaimerText}>
              本测试仅供自我了解使用，不能替代专业心理诊断。如测试结果显示需要关注，建议咨询专业心理咨询师或医生。
            </Text>
          </View>
        </View>

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
    width: 38, height: 38, borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 22, color: theme.colors.text, fontWeight: '600' },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: 'bold', color: theme.colors.text },

  intro: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg, marginBottom: theme.spacing.lg,
    borderWidth: 1, borderColor: theme.colors.border + '30',
  },
  introTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.xs },
  introDesc: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 20 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg, marginBottom: theme.spacing.md,
    borderWidth: 1, borderColor: theme.colors.border, borderLeftWidth: 3,
    ...theme.shadows.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  cardIconBox: {
    width: 44, height: 44, borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardIcon: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: 3 },
  cardDesc: { fontSize: 11, color: theme.colors.textSecondary, lineHeight: 16 },
  cardGo: { fontSize: 20, color: theme.colors.textLight, marginLeft: theme.spacing.sm },

  cardMeta: {
    flexDirection: 'row', gap: theme.spacing.md,
    marginTop: theme.spacing.md, paddingTop: theme.spacing.md,
    borderTopWidth: 1, borderTopColor: theme.colors.border + '40',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { fontSize: 12, marginRight: 3 },
  metaText: { fontSize: 10, color: theme.colors.textLight },

  levelsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: theme.spacing.md },
  levelPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.borderRadius.full,
  },
  levelDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  levelLabel: { fontSize: 9, color: theme.colors.textSecondary },

  disclaimer: {
    flexDirection: 'row', marginTop: theme.spacing.md,
    backgroundColor: '#FDCB6E' + '08', borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, borderLeftWidth: 3, borderLeftColor: theme.colors.accent,
  },
  disclaimerIcon: { fontSize: 18, marginRight: theme.spacing.sm },
  disclaimerBody: { flex: 1 },
  disclaimerTitle: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.text, marginBottom: 2 },
  disclaimerText: { fontSize: 11, color: theme.colors.textSecondary, lineHeight: 17 },
});
