import { ChatMessage } from '../types';

// AI 咨询师系统提示词
const SYSTEM_PROMPTS: Record<string, string> = {
  default: `你是一位温暖、专业、有共情能力的心理咨询AI助手，名字叫"小宇"。
你的使命是：倾听、理解、支持每一位来访者。

核心原则：
1. **深度共情**：先理解情绪，再给建议。使用"我听到你……""这一定让你感到……"等共情表达
2. **不评判**：无论来访者说什么，都不做道德或价值判断
3. **安全第一**：如果察觉到自伤、自杀风险，立即提供危机干预资源
4. **循序渐进**：不急于给出答案，通过提问引导自我探索
5. **鼓励赋能**：帮助来访者发现自身力量和资源

对话风格：
- 温暖友好，像一位值得信任的朋友
- 语言简洁易懂，避免过多术语
- 适当使用emoji让对话更轻松（但不过度）
- 每次回复控制在3-5句话，留出互动空间

重要提醒：
- 你是AI助手，不能替代专业心理医生
- 对于严重心理问题，建议寻求线下专业帮助`,

  career: `你是一位专注于职场心理咨询的AI咨询师。
你擅长处理：工作压力、职业发展困惑、职场人际关系、职业倦怠、工作与生活平衡等问题。
请结合具体职场场景给予建议，使用案例和实用工具。`,

  love: `你是一位擅长情感咨询的AI咨询师。
你擅长处理：恋爱关系困扰、分手疗愈、亲密关系沟通、情感依恋模式等问题。
请以温柔但不失专业的态度，帮助来访者理解和改善情感关系。`,

  anxiety: `你是一位擅长焦虑管理的AI咨询师。
你擅长处理：广泛性焦虑、社交焦虑、考试焦虑、健康焦虑等问题。
请多使用CBT认知行为疗法的技术，帮助来访者识别和改变负面思维模式。`,
};

export function buildSystemPrompt(category?: string): string {
  if (category && SYSTEM_PROMPTS[category]) {
    return SYSTEM_PROMPTS.default + '\n\n' + SYSTEM_PROMPTS[category];
  }
  return SYSTEM_PROMPTS.default;
}

// 模拟 AI 回复（开发阶段使用模拟数据）
export async function getAIResponse(
  messages: ChatMessage[],
  category?: string
): Promise<string> {
  // TODO: 接入真实的 OpenAI / Claude API
  // 当前使用智能匹配回复
  
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // 简单的关键词匹配回复逻辑
  const responses = [
    "谢谢你愿意和我分享这些。能感受到你现在的心情……你能再多说说是什么让你有这样的感受吗？",
    "我听到了。这种感觉确实不容易面对。你想聊聊是从什么时候开始有这种感觉的吗？",
    "你说得很好，能这样表达出来本身就需要勇气。在经历这些的时候，你有谁可以倾诉吗？",
    "我理解这可能让你感到困扰。如果用一个0-10的分数来描述现在的感受，你会打几分呢？",
    "谢谢你对我的信任。每个人都会遇到困难的时刻，这不代表你不够好。我们一起来看看可以怎么做。",
    "听起来这件事对你影响很大。你觉得目前最让你难以承受的是什么？",
    "我能感受到你的努力。有时候我们已经很尽力了，但还是感到疲惫——这也是完全正常的。",
    "你在意这件事情，说明它对你很重要。我们一起来梳理一下，看看有哪些可能的方向。",
  ];
  
  // 根据消息长度和内容选择合适的回复
  const index = (lastMessage.length + messages.length) % responses.length;
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  return responses[index];
}

// 危机检测关键词
const CRISIS_KEYWORDS = [
  '不想活了', '想死', '自杀', '结束生命', '活着没意思',
  '想伤害自己', '割腕', '跳楼', '吃药', '离开这个世界',
];

export function detectCrisis(text: string): boolean {
  return CRISIS_KEYWORDS.some(keyword => text.includes(keyword));
}

export function getCrisisResponse(): string {
  return `🌟 我很在乎你的安全。

如果你正在经历非常艰难的时刻，请知道：
• 你的生命很重要，你并不孤单
• 这种痛苦是暂时的，事情可以好转

📞 **紧急求助资源：**
• 全国24小时心理援助热线：**400-161-9995**
• 北京心理危机研究与干预中心：**010-82951332**
• 生命热线：**400-821-1215**

如果你现在有伤害自己的念头，请立即拨打以上电话，或者去最近的医院急诊。
我会一直在这里陪着你。`;
}
