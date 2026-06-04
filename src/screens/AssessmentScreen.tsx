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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { allAssessments } from '../data/assessments';
import { subcategoryAssessments } from '../data/subcategoryAssessments';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;
type Route = RouteProp<RootStackParamList, 'Assessment'>;
const { width: SCREEN_W } = Dimensions.get('window');

export default function AssessmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Route>();
  const { assessmentId, categoryId, subcategoryId } = route.params;

  const assessment = subcategoryAssessments.find(a => a.id === assessmentId)
    || allAssessments.find(a => a.id === assessmentId)!;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 动画
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionSlideAnim = useRef(new Animated.Value(0)).current;

  const question = assessment.questions[currentQuestion];
  const totalQuestions = assessment.questions.length;
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / totalQuestions) * 100;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // 进度条动画
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 题目切换动画
  const animateQuestionChange = () => {
    Animated.sequence([
      Animated.timing(questionSlideAnim, { toValue: -20, duration: 120, useNativeDriver: true }),
      Animated.timing(questionSlideAnim, { toValue: 30, duration: 0, useNativeDriver: true }),
      Animated.spring(questionSlideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleSelectOption = (score: number, index: number) => {
    setSelectedOption(index);
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        animateQuestionChange();
      } else {
        setShowResult(true);
      }
    }, 400);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      animateQuestionChange();
    } else {
      navigation.goBack();
    }
  };

  const calculateScore = () => Object.values(answers).reduce((sum, s) => sum + s, 0);
  const getInterpretation = () => {
    const score = calculateScore();
    return assessment.interpretation.find(
      interp => score >= interp.range[0] && score <= interp.range[1]
    ) || assessment.interpretation[0];
  };

  // ====== 结果页 ======
  if (showResult) {
    const score = calculateScore();
    const interp = getInterpretation();

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <Text style={styles.backIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>测评结果</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* 分数卡片 */}
            <View style={[styles.resultCard, { borderColor: interp.color + '40' }]}>
              <View style={[styles.resultColorBar, { backgroundColor: interp.color }]} />
              <Text style={styles.resultEmoji}>📊</Text>
              <Text style={styles.resultTestName}>{assessment.title}</Text>
              <View style={[styles.scoreRing, { borderColor: interp.color + '30' }]}>
                <Text style={[styles.scoreNumber, { color: interp.color }]}>{score}</Text>
                <Text style={styles.scoreMax}>/ {assessment.scoring.max}{assessment.scoring.unit}</Text>
              </View>
              <View style={[styles.levelTag, { backgroundColor: interp.color + '18' }]}>
                <View style={[styles.levelDot, { backgroundColor: interp.color }]} />
                <Text style={[styles.levelName, { color: interp.color }]}>{interp.level}</Text>
              </View>
              <Text style={styles.resultDesc}>{interp.description}</Text>
            </View>

            {/* 建议卡片 */}
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionIcon}>💡</Text>
                <Text style={styles.suggestionTitle}>专业建议</Text>
              </View>
              <Text style={styles.suggestionBody}>{interp.suggestion}</Text>
            </View>

            {/* 危机提示 */}
            {score >= (assessment.scoring.max * 0.6) && (
              <View style={styles.crisisBox}>
                <Text style={styles.crisisEmoji}>🆘</Text>
                <Text style={styles.crisisTitle}>需要额外关注</Text>
                <Text style={styles.crisisBody}>
                  如果你感到非常困扰，请考虑寻求专业心理帮助。{'\n'}
                  全国24小时心理援助热线：{'\n'}
                  <Text style={{ fontWeight: 'bold', color: theme.colors.error }}>400-161-9995</Text>
                </Text>
              </View>
            )}

            {/* 开始咨询按钮 */}
            <TouchableOpacity
              style={styles.startChatBtn}
              onPress={() => navigation.replace('Chat', { category: categoryId, subcategory: subcategoryId })}
              activeOpacity={0.85}
            >
              <Text style={styles.startChatBtnText}>开始咨询 →</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ====== 答题页 ======
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress */}
      <Animated.View style={[styles.quizHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {currentQuestion + 1} / {totalQuestions}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.skipQuizBtn}
          onPress={() => navigation.replace('Chat', { category: categoryId, subcategory: subcategoryId })}
          activeOpacity={0.7}
        >
          <Text style={styles.skipQuizText}>跳过</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 题目区域 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.questionContent}
      >
        <Animated.View style={{ transform: [{ translateX: questionSlideAnim }] }}>
          {/* 题号标签 */}
          <View style={styles.qIndexRow}>
            <View style={styles.qIndexTag}>
              <Text style={styles.qIndexText}>Q{currentQuestion + 1}</Text>
            </View>
            {currentQuestion > 0 && (
              <TouchableOpacity
                onPress={goBack}
                activeOpacity={0.7}
                style={styles.prevBtn}
              >
                <Text style={styles.prevBtnText}>← 上一题</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.qText}>{question.text}</Text>

          {/* 选项列表 */}
          <View style={styles.optionsList}>
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const wasAnswered = answers[question.id] === option.score;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    (isSelected || wasAnswered) && [
                      styles.optionItemSelected,
                      { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '08' },
                    ],
                  ]}
                  onPress={() => handleSelectOption(option.score, index)}
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.optionRadio,
                    (isSelected || wasAnswered) && [
                      styles.optionRadioSelected,
                      { borderColor: theme.colors.primary },
                    ],
                  ]}>
                    {(isSelected || wasAnswered) && (
                      <View style={[styles.radioDot, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionLabel,
                    (isSelected || wasAnswered) && styles.optionLabelSelected,
                  ]}>
                    {option.text}
                  </Text>
                  
                  {(isSelected || wasAnswered) && (
                    <View style={[styles.checkMark, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.checkMarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // ====== 共用 Header ======
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  headerTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },

  // ====== 答题页 ======
  quizHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  progressArea: { flex: 1 },
  progressTrack: {
    height: 6, backgroundColor: theme.colors.border + '30',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  progressLabel: {
    fontSize: 10, color: theme.colors.textLight,
    textAlign: 'center', marginTop: 4, fontWeight: '600',
  },
  skipQuizBtn: {
    paddingHorizontal: theme.spacing.md, paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  skipQuizText: { fontSize: 12, fontWeight: '600', color: theme.colors.textLight },

  questionContent: {
    padding: theme.spacing.lg, paddingTop: theme.spacing.xl,
  },

  // 题号行
  qIndexRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  qIndexTag: {
    backgroundColor: theme.colors.primary + '18',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 12, paddingVertical: 3,
  },
  qIndexText: {
    fontSize: 11, fontWeight: '700', color: theme.colors.primary,
    letterSpacing: 1,
  },
  prevBtn: {
    paddingHorizontal: theme.spacing.sm, paddingVertical: 4,
  },
  prevBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.textLight },

  qText: {
    fontSize: theme.fontSize.xl, fontWeight: '700',
    color: theme.colors.text, lineHeight: 30,
    marginBottom: theme.spacing.xl,
  },

  // 选项
  optionsList: { gap: theme.spacing.sm },
  optionItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1.5, borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  optionItemSelected: {
    borderWidth: 1.5,
    elevation: 3,
  },
  optionRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: theme.colors.textLight + '60',
    marginRight: theme.spacing.md,
    alignItems: 'center', justifyContent: 'center',
  },
  optionRadioSelected: { borderWidth: 2 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: {
    flex: 1, fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary, lineHeight: 20,
  },
  optionLabelSelected: { color: theme.colors.text, fontWeight: '600' },
  checkMark: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMarkText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' },

  // ====== 结果页 ======
  resultContent: { padding: theme.spacing.lg },
  resultCard: {
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl, alignItems: 'center',
    borderWidth: 1.5, overflow: 'hidden',
    ...theme.shadows.lg,
  },
  resultColorBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
  },
  resultEmoji: { fontSize: 44, marginTop: theme.spacing.md, marginBottom: theme.spacing.sm },
  resultTestName: {
    fontSize: theme.fontSize.md, fontWeight: '600',
    color: theme.colors.textSecondary, marginBottom: theme.spacing.md,
  },
  scoreRing: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreNumber: { fontSize: 42, fontWeight: 'bold' },
  scoreMax: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  levelTag: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.full, marginBottom: theme.spacing.md,
  },
  levelDot: { width: 8, height: 8, borderRadius: 4, marginRight: theme.spacing.xs },
  levelName: { fontSize: theme.fontSize.md, fontWeight: '700' },
  resultDesc: {
    fontSize: theme.fontSize.sm, color: theme.colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },

  // Suggestion
  suggestionCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  suggestionHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  suggestionIcon: { fontSize: 18, marginRight: theme.spacing.xs },
  suggestionTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },
  suggestionBody: {
    fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 22,
  },

  // Crisis
  crisisBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: '#FF7675' + '08',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 3, borderLeftColor: theme.colors.error,
  },
  crisisEmoji: { fontSize: 22, marginBottom: theme.spacing.xs },
  crisisTitle: {
    fontSize: theme.fontSize.md, fontWeight: '700',
    color: theme.colors.error, marginBottom: theme.spacing.xs,
  },
  crisisBody: {
    fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 20,
  },

  // Start Chat Button
  startChatBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  startChatBtnText: {
    fontSize: theme.fontSize.md, fontWeight: '700', color: '#FFFFFF',
  },
});
