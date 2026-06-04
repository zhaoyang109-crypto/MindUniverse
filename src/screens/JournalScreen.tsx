import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { JournalEntry, MoodType } from '../types';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Journal'>;

const MOODS = [
  { type: 'great' as MoodType, emoji: '🤩', label: '很棒', color: '#00B894' },
  { type: 'good' as MoodType, emoji: '😊', label: '不错', color: '#00CEC9' },
  { type: 'okay' as MoodType, emoji: '😐', label: '一般', color: '#FDCB6E' },
  { type: 'bad' as MoodType, emoji: '😔', label: '不太好', color: '#FD79A8' },
  { type: 'terrible' as MoodType, emoji: '😢', label: '很糟糕', color: '#FF7675' },
];

const TAGS = ['工作', '学习', '家庭', '朋友', '健康', '睡眠', '恋爱', '金钱', '自我', '社交'];

export default function JournalScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodScore, setMoodScore] = useState(5);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [gratitude, setGratitude] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saved, setSaved] = useState(false);

  // 动画
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const saveScaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // 心情分数展开动画
  useEffect(() => {
    if (selectedMood) {
      Animated.spring(scoreAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
    } else {
      Animated.timing(scoreAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [selectedMood]);

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSave = () => {
    if (!selectedMood) return;
    
    // 按钮动画
    Animated.sequence([
      Animated.spring(saveScaleAnim, { toValue: 0.95, friction: 8, useNativeDriver: true }),
      Animated.spring(saveScaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();

    setEntries(prev => [{
      id: `j-${Date.now()}`, date: new Date().toISOString().split('T')[0],
      mood: selectedMood, moodScore, content, tags,
      gratitude: gratitude || undefined,
    }, ...prev]);
    
    // 显示成功状态
    setSaved(true);
    Animated.spring(successAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    
    setTimeout(() => {
      setSelectedMood(null); setMoodScore(5); setContent(''); setTags([]); setGratitude('');
      setSaved(false);
      Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }, 2000);
  };

  const activeColor = MOODS.find(m => m.type === selectedMood)?.color || theme.colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📔 情绪日记</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Date */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </Text>
        </Animated.View>

        {/* Mood Selector */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <Text style={styles.sectionLabel}>今天感觉如何？</Text>
          <View style={styles.moodRow}>
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.type;
              return (
                <TouchableOpacity
                  key={mood.type}
                  style={[
                    styles.moodItem,
                    isSelected && [
                      styles.moodItemSelected,
                      { backgroundColor: mood.color + '12', borderColor: mood.color },
                    ],
                  ]}
                  onPress={() => setSelectedMood(mood.type)}
                  activeOpacity={0.75}
                >
                  <Animated.Text style={[
                    styles.moodEmoji,
                    isSelected && { transform: [{ scale: 1.2 }] },
                  ]}>
                    {mood.emoji}
                  </Animated.Text>
                  <Text style={[
                    styles.moodLabel,
                    isSelected && { color: mood.color, fontWeight: '700' },
                  ]}>{mood.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Score - 带展开动画 */}
          <Animated.View style={[
            styles.scoreArea,
            {
              maxHeight: scoreAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120], extrapolate: 'clamp' }),
              opacity: scoreAnim,
            },
          ]}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>心情指数</Text>
              <Text style={[styles.scoreValue, { color: activeColor }]}>{moodScore}<Text style={styles.scoreMax}> /10</Text></Text>
            </View>
            <View style={styles.scoreTrack}>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.scoreDot,
                    moodScore >= num && { backgroundColor: activeColor },
                    moodScore === num && styles.scoreDotCurrent,
                  ]}
                  onPress={() => setMoodScore(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.scoreDotNum, moodScore >= num && { color: '#FFF' }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <Text style={styles.sectionLabel}>✍️ 记录今天</Text>
          <TextInput
            style={styles.textArea}
            placeholder="发生了什么？有什么感受..."
            placeholderTextColor={theme.colors.textLight}
            value={content} onChangeText={setContent} multiline
            textAlignVertical="top" maxLength={1000}
          />
          <Text style={styles.charCount}>{content.length}/1000</Text>
        </Animated.View>

        {/* Tags */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <Text style={styles.sectionLabel}>🏷️ 标签</Text>
          <View style={styles.tagsRow}>
            {TAGS.map(tag => {
              const isActive = tags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    isActive && [styles.tagChipActive, { backgroundColor: activeColor + '15', borderColor: activeColor }],
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tagText, isActive && { color: activeColor, fontWeight: '600' }]}>#{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Gratitude */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          <Text style={styles.sectionLabel}>💛 感恩时刻</Text>
          <TextInput
            style={[styles.textArea, { height: 80 }]}
            placeholder="今天有什么值得感恩的？"
            placeholderTextColor={theme.colors.textLight}
            value={gratitude} onChangeText={setGratitude} multiline textAlignVertical="top"
          />
        </Animated.View>

        {/* Save */}
        <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
          <TouchableOpacity
            style={[styles.saveBtn, !selectedMood && styles.saveBtnDisabled]}
            onPress={handleSave} disabled={!selectedMood || saved} activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {saved ? '已保存 ✅' : '保存今天的心情 🌟'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Success 提示 */}
        {saved && (
          <Animated.View style={[styles.successToast, { opacity: successAnim, transform: [{ scale: successAnim }] }]}>
            <Text style={styles.successToastText}>✨ 心情已记录，好好照顾自己</Text>
          </Animated.View>
        )}

        {/* Recent */}
        {entries.length > 0 && (
          <View style={[styles.section, { marginTop: theme.spacing.xl }]}>
            <Text style={styles.sectionLabel}>📖 最近记录</Text>
            {entries.slice(0, 3).map(entry => {
              const m = MOODS.find(mo => mo.type === entry.mood)!;
              return (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={[styles.entryMoodIcon, { backgroundColor: m.color + '15' }]}>
                    <Text>{m.emoji}</Text>
                  </View>
                  <View style={styles.entryBody}>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                    <Text style={styles.entryContent} numberOfLines={2}>{entry.content || '(无文字)'}</Text>
                  </View>
                  <View style={styles.entryScore}>
                    <Text style={[styles.entryScoreNum, { color: m.color }]}>{entry.moodScore}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

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
    marginBottom: theme.spacing.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 18, color: theme.colors.text, fontWeight: '700', top: -1 },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: 'bold', color: theme.colors.text },

  dateText: {
    fontSize: theme.fontSize.sm, color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },

  section: { marginBottom: theme.spacing.xl, overflow: 'hidden' },
  sectionLabel: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.md },

  // Mood
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: {
    flex: 1, alignItems: 'center', paddingVertical: theme.spacing.sm + 2,
    marginHorizontal: 2, borderRadius: theme.borderRadius.md,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  moodItemSelected: { borderWidth: 1.5 },
  moodEmoji: { fontSize: 28, marginBottom: 3 },
  moodLabel: { fontSize: 10, color: theme.colors.textSecondary },

  // Score
  scoreArea: { marginTop: theme.spacing.md, overflow: 'hidden' },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  scoreLabel: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary },
  scoreValue: { fontSize: theme.fontSize.xl, fontWeight: 'bold' },
  scoreMax: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  scoreTrack: { flexDirection: 'row', gap: 4 },
  scoreDot: {
    flex: 1, height: 34, borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.border + '60',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreDotCurrent: {
    transform: [{ scale: 1.08 }],
    elevation: 2,
  },
  scoreDotNum: { fontSize: 11, fontWeight: '600', color: theme.colors.textLight },

  // Text Area
  textArea: {
    minHeight: 120, backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg, borderWidth: 1,
    borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md, fontSize: theme.fontSize.sm, color: theme.colors.text,
    ...theme.shadows.sm,
  },
  charCount: { fontSize: 10, color: theme.colors.textLight, textAlign: 'right', marginTop: 6 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  tagChip: {
    paddingHorizontal: theme.spacing.md, paddingVertical: 5,
    borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  tagChipActive: { borderWidth: 1.5 },
  tagText: { fontSize: 11, color: theme.colors.textSecondary },

  // Save
  saveBtn: {
    backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg, alignItems: 'center', ...theme.shadows.md,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: theme.fontSize.md, fontWeight: '700', color: '#FFF' },

  // Success Toast
  successToast: {
    marginTop: theme.spacing.md,
    backgroundColor: '#00B894' + '18',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B894' + '40',
  },
  successToastText: { fontSize: 13, fontWeight: '600', color: '#00B894' },

  // Entries
  entryCard: {
    flexDirection: 'row', backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg, padding: theme.spacing.md,
    marginBottom: theme.spacing.sm, ...theme.shadows.sm,
    alignItems: 'center',
  },
  entryMoodIcon: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
  },
  entryBody: { flex: 1 },
  entryDate: { fontSize: 10, color: theme.colors.textLight, marginBottom: 2 },
  entryContent: { fontSize: theme.fontSize.sm, color: theme.colors.text, lineHeight: 18 },
  entryScore: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  entryScoreNum: { fontSize: 13, fontWeight: '700' },
});
