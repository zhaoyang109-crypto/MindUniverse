// 咨询方向分类
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 心理测试
export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string; // 关联的分类ID
  questions: AssessmentQuestion[];
  scoring: ScoringRule;
  interpretation: ScoreInterpretation[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  text: string;
  score: number;
}

export interface ScoringRule {
  min: number;
  max: number;
  unit: string;
}

export interface ScoreInterpretation {
  range: [number, number];
  level: string;
  description: string;
  suggestion: string;
  color: string;
}

// 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice';
  voiceUri?: string;
}

// 情绪日记
export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  moodScore: number; // 1-10
  content: string;
  tags: string[];
  gratitude?: string;
}

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

// 正念练习
export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // 分钟
  category: 'breathing' | 'body' | 'visualization' | 'meditation';
  icon: string;
  color: string;
  steps: ExerciseStep[];
}

export interface ExerciseStep {
  instruction: string;
  duration?: number; // 秒
}
