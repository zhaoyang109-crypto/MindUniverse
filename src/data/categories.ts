import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'growth',
    name: '成长',
    icon: '🌱',
    description: '探索自我，发现更好的自己',
    color: '#7CB9A8',
    subcategories: [
      { id: 'career', name: '职场', icon: '💼', description: '工作压力、职业发展、人际关系' },
      { id: 'study', name: '学习', icon: '📚', description: '学习焦虑、考试压力、动力不足' },
      { id: 'self', name: '自我认知', icon: '🪞', description: '自我价值、身份认同、人生目标' },
      { id: 'habit', name: '习惯养成', icon: '🔄', description: '拖延症、自律、生活规律' },
    ],
  },
  {
    id: 'emotion',
    name: '情感',
    icon: '💝',
    description: '理解情绪，拥抱内心感受',
    color: '#E8A5B3',
    subcategories: [
      { id: 'family', name: '亲情', icon: '🏠', description: '家庭关系、代际沟通、家庭期望' },
      { id: 'friendship', name: '友情', icon: '🤝', description: '友谊维护、社交焦虑、孤独感' },
      { id: 'love', name: '爱情', icon: '❤️', description: '恋爱关系、分手疗愈、亲密关系' },
      { id: 'grief', name: '失落与哀伤', icon: '🍂', description: '失去亲人、离别痛苦、哀伤处理' },
    ],
  },
  {
    id: 'mental',
    name: '心理健康',
    icon: '🧠',
    description: '关注内心，守护心理平衡',
    color: '#B8A9D4',
    subcategories: [
      { id: 'anxiety', name: '焦虑', icon: '😰', description: '广泛性焦虑、惊恐发作、不安感' },
      { id: 'depression', name: '情绪低落', icon: '☁️', description: '持续低落、失去兴趣、无力感' },
      { id: 'stress', name: '压力管理', icon: '🎯', description: '慢性压力、倦怠感、身心疲惫' },
      { id: 'sleep', name: '睡眠问题', icon: '😴', description: '失眠、噩梦、作息紊乱' },
    ],
  },
  {
    id: 'life',
    name: '生活适应',
    icon: '🌈',
    description: '适应变化，找到生活的节奏',
    color: '#F0C38E',
    subcategories: [
      { id: 'change', name: '变化与适应', icon: '🔄', description: '环境变动、角色转换、不确定性' },
      { id: 'confidence', name: '自信建立', icon: '✨', description: '自卑、自我怀疑、勇气' },
      { id: 'decision', name: '决策困难', icon: '⚖️', description: '选择困难、犹豫不决、害怕犯错' },
      { id: 'balance', name: '工作生活平衡', icon: '⚖️', description: '时间管理、边界设定、精力分配' },
    ],
  },
];
