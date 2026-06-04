import { Assessment } from '../types';

// PHQ-9 抑郁筛查量表
export const phq9Assessment: Assessment = {
  id: 'phq-9',
  title: 'PHQ-9 心情自测',
  description: '过去两周内，以下问题困扰你的频率如何？',
  category: 'mental',
  questions: [
    { id: 'p1', text: '做事时提不起劲或没有兴趣', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p2', text: '感到心情低落、沮丧或绝望', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p3', text: '入睡困难、睡眠不深或嗜睡', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p4', text: '感觉疲倦或没有活力', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p5', text: '食欲不振或吃太多', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p6', text: '觉得自己很差或很失败', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p7', text: '对事物难以集中注意力', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p8', text: '动作或说话缓慢到别人能察觉，或者相反——烦躁坐立不安', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'p9', text: '有不如死掉或伤害自己的念头', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
  ],
  scoring: { min: 0, max: 27, unit: '分' },
  interpretation: [
    { range: [0, 4], level: '正常', description: '你的情绪状态良好', suggestion: '保持健康的生活方式和积极的心态，继续关注自己的心理状态。', color: '#7CB9A8' },
    { range: [5, 9], level: '轻度', description: '存在轻度情绪波动，建议关注自我调节', suggestion: '尝试运动、社交、培养兴趣爱好。如果持续超过两周，建议寻求专业帮助。', color: '#F0C38E' },
    { range: [10, 14], level: '中度', description: '存在中度情绪困扰，需要重视', suggestion: '建议寻求心理咨询师的帮助，同时可以尝试正念练习和规律作息。', color: '#E8A5B3' },
    { range: [15, 19], level: '中重度', description: '存在明显的情绪困扰', suggestion: '强烈建议尽快寻求专业心理医生或咨询师的帮助。你不是一个人在战斗。', color: '#D4726A' },
    { range: [20, 27], level: '重度', description: '存在严重的情绪困扰，需要专业干预', suggestion: '请务必尽快就医或联系专业心理机构。如果你有伤害自己的念头，请立即拨打心理援助热线。', color: '#C94C4C' },
  ],
};

// GAD-7 焦虑筛查量表
export const gad7Assessment: Assessment = {
  id: 'gad-7',
  title: 'GAD-7 焦虑自测',
  description: '过去两周内，以下问题困扰你的频率如何？',
  category: 'mental',
  questions: [
    { id: 'g1', text: '感到紧张、焦虑或急躁', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g2', text: '无法控制地担心', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g3', text: '对各种事情担忧过多', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g4', text: '很难放松下来', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g5', text: '坐立不安、难以静坐', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g6', text: '变得容易烦躁或急躁', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
    { id: 'g7', text: '感到害怕，好像有什么可怕的事情会发生', options: [
      { text: '完全不会', score: 0 }, { text: '好几天', score: 1 },
      { text: '一半以上的天数', score: 2 }, { text: '几乎每天', score: 3 },
    ]},
  ],
  scoring: { min: 0, max: 21, unit: '分' },
  interpretation: [
    { range: [0, 4], level: '正常', description: '你的焦虑水平在正常范围内', suggestion: '继续保持良好的生活习惯和心态管理方式。', color: '#7CB9A8' },
    { range: [5, 9], level: '轻度', description: '存在轻度焦虑倾向', suggestion: '尝试深呼吸、渐进式肌肉放松等技巧。规律运动也有助于缓解焦虑。', color: '#F0C38E' },
    { range: [10, 14], level: '中度', description: '存在中度焦虑症状', suggestion: '建议学习系统的放松技巧，如冥想、正念。如果影响日常生活，请考虑咨询专业人士。', color: '#E8A5B3' },
    { range: [15, 21], level: '重度', description: '存在明显的焦虑症状', suggestion: '强烈建议寻求专业心理帮助。焦虑是可以被有效治疗的，你值得拥有平静的生活。', color: '#D4726A' },
  ],
};

// 压力感知简版
export const pssAssessment: Assessment = {
  id: 'pss-10',
  title: '压力感知自测',
  description: '请根据最近一个月的感受作答：',
  category: 'mental',
  questions: [
    { id: 's1', text: '因发生意料之外的事情而感到心烦意乱', options: [
      { text: '从不', score: 0 }, { text: '偶尔', score: 1 },
      { text: '有时', score: 2 }, { text: '常常', score: 3 }, { text: '总是', score: 4 },
    ]},
    { id: 's2', text: '感觉不能控制生活中重要的事情', options: [
      { text: '从不', score: 4 }, { text: '偶尔', score: 3 },
      { text: '有时', score: 2 }, { text: '常常', score: 1 }, { text: '总是', score: 0 },
    ]},
    { id: 's3', text: '感到紧张和压力', options: [
      { text: '从不', score: 0 }, { text: '偶尔', score: 1 },
      { text: '有时', score: 2 }, { text: '常常', score: 3 }, { text: '总是', score: 4 },
    ]},
    { id: 's4', text: '能成功处理生活中令人烦恼的事', options: [
      { text: '从不', score: 4 }, { text: '偶尔', score: 3 },
      { text: '有时', score: 2 }, { text: '常常', score: 1 }, { text: '总是', score: 0 },
    ]},
    { id: 's5', text: '感觉能有效地处理生活中重要的事情', options: [
      { text: '从不', score: 4 }, { text: '偶尔', score: 3 },
      { text: '有时', score: 2 }, { text: '常常', score: 1 }, { text: '总是', score: 0 },
    ]},
  ],
  scoring: { min: 0, max: 20, unit: '分' },
  interpretation: [
    { range: [0, 6], level: '低压力', description: '你目前的压力水平较低', suggestion: '很好！继续保持健康的生活方式，关注压力预防。', color: '#7CB9A8' },
    { range: [7, 13], level: '中等压力', description: '你感受到一定程度的压力', suggestion: '尝试建立规律的作息，保证充足睡眠，适当运动。学会说"不"，设定合理边界。', color: '#F0C38E' },
    { range: [14, 20], level: '高压力', description: '你目前承受着较高的压力', suggestion: '压力过大时请及时寻求支持——和朋友倾诉、做放松练习、必要时咨询专业心理人士。照顾好自己是第一位的。', color: '#E8A5B3' },
  ],
};

export const allAssessments = [phq9Assessment, gad7Assessment, pssAssessment];
