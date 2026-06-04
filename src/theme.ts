export const theme = {
  colors: {
    // 主色系 - 阳光明亮
    primary: '#5B8DEF',        // 天空蓝
    primaryLight: '#89B4F7',
    primaryDark: '#3A6DD1',
    secondary: '#FF7EB3',      // 樱花粉
    secondaryLight: '#FFB3D0',
    accent: '#FFC94D',         // 阳光金
    background: '#F8FAFC',     // 暖白背景
    surface: '#FFFFFF',        // 纯白卡片
    surfaceLight: '#F1F5F9',   // 浅灰次级卡片
    text: '#1E293B',           // 深色主文字
    textSecondary: '#64748B',  // 灰色次要文字
    textLight: '#94A3B8',      // 弱化文字
    border: '#E2E8F0',
    
    // 分类颜色 - 明亮温暖
    growth: '#10B981',         // 翠绿 - 成长
    emotion: '#F472B6',        // 玫粉 - 情感
    mental: '#818CF8',         // 薰紫 - 心理健康
    life: '#FBBF24',           // 琥珀 - 生活
    
    // 功能色
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
    display: 44,
  },
  
  shadows: {
    none: {},
    sm: { shadowColor: 'rgba(0,0,0,0.08)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 },
    md: { shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4 },
    lg: { shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 20, elevation: 6 },
    glow: (color: string) => ({ 
      shadowColor: color, 
      shadowOffset: { width: 0, height: 0 }, 
      shadowOpacity: 0.25, 
      shadowRadius: 16, 
      elevation: 4 
    }),
  },
  
  gradients: {
    primary: ['#5B8DEF', '#89B4F7'],
    warm: ['#FF7EB3', '#FFC94D'],
    ocean: ['#38BDF8', '#34D399'],
    sunset: ['#FB923C', '#F472B6'],
    aurora: ['#34D399', '#818CF8'],
    sunny: ['#FEF3C7', '#FDE68A'],   // 新增：阳光渐变
    sky: ['#EFF6FF', '#DBEAFE'],     // 新增：天空渐变
  },
};

export type Theme = typeof theme;
