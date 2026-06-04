import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { categories } from '../data/categories';
import { getAIResponse, detectCrisis } from '../services/ai';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProp>();
  const { category: catId, subcategory: subId } = route.params ?? {};

  // 找到分类信息
  let catInfo = categories.find(c => c.id === catId);
  if (catInfo && subId) {
    catInfo = { ...catInfo };
  }
  const title = catInfo ? `${catInfo.icon} ${catInfo.name}` : '💬 随便聊聊';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `你好！我是你的心理咨询助手。${catInfo ? `关于「${catInfo.name}」` : '任何话题'}，你都可以和我聊聊。我会认真倾听，陪你一起探索。`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 输入框聚焦动画
  const [inputFocused, setInputFocused] = useState(false);
  const inputBgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // 打字指示器动画
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).stop();
    }
  }, [isTyping]);

  // 输入框聚焦动画
  const handleInputFocus = () => {
    setInputFocused(true);
    Animated.timing(inputBgAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    Animated.timing(inputBgAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
  };

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 滚动到底部
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await getAIResponse(messages, catId);
      
      // 危机检测
      if (detectCrisis(text)) {
        const crisisMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '我注意到你可能正在经历一些困难。如果你需要紧急帮助，请拨打心理援助热线：\n\n📞 全国24小时心理援助热线：400-161-9995\n📞 北京心理危机研究与干预中心：010-82951332\n\n记住，寻求帮助是勇敢的表现。',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, crisisMsg]);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 3).toString(),
        role: 'assistant',
        content: '抱歉，我现在无法回复。请稍后再试，或者尝试重新发送消息。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [inputText, messages, catId, subId]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: 实现语音输入
  };

  // 渲染消息气泡
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowRight : styles.messageRowLeft,
          { opacity: fadeAnim },
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={styles.avatarEmoji}>🌟</Text>
          </View>
        )}
        
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          <Text style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant,
          ]}>
            {item.content}
          </Text>
          
          {/* 时间戳 */}
          <Text style={[
            styles.timestamp,
            isUser ? styles.timestampRight : styles.timestampLeft,
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.avatarEmoji, { fontSize: 14 }]}>你</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Header ====== */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={[styles.statusDot, { backgroundColor: '#4ECDC4' }]} />
        </View>

        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ====== 消息列表 ====== */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* ====== 打字指示器 ====== */}
      {isTyping && (
        <Animated.View
          style={[
            styles.typingIndicator,
            { opacity: pulseAnim, transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.typingDot} />
          <View style={[styles.typingDot, { opacity: 0.7 }]} />
          <View style={[styles.typingDot, { opacity: 0.4 }]} />
          <Text style={styles.typingText}>AI 正在思考...</Text>
        </Animated.View>
      )}

      {/* ====== 输入区域 ====== */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[
            styles.inputArea,
            {
              backgroundColor: inputBgAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.colors.surface, theme.colors.background],
                extrapolate: 'clamp',
              }),
              borderColor: inputFocused ? theme.colors.primary + '50' : theme.colors.border,
              borderWidth: inputFocused ? 1.5 : 1,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.voiceBtn,
              isRecording && styles.voiceBtnActive,
            ]}
            onPress={toggleRecording}
            activeOpacity={0.7}
          >
            <Text style={[styles.voiceIcon, isRecording && styles.voiceIconActive]}>
              🎤
            </Text>
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入你想说的..."
            placeholderTextColor={theme.colors.textLight}
            multiline
            maxLength={500}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onSubmitEditing={() => sendMessage()}
            blurOnSubmit={false}
          />

          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={sendMessage}
              activeOpacity={0.75}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sendBtnDisabled}>
              <Text style={styles.sendIconDisabled}>↑</Text>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 屏幕宽度常量
const { width: SCREEN_W } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + '30',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backIcon: { fontSize: 18, color: theme.colors.text, fontWeight: '700', top: -1 },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  statusDot: {
    width: 7, height: 7, borderRadius: 4,
    marginTop: 3,
  },
  moreBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...theme.shadows.sm,
  },
  moreIcon: { fontSize: 22, color: theme.colors.text },

  // Messages
  messagesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    maxWidth: SCREEN_W * 0.82,
    alignItems: 'flex-end',
  },
  messageRowLeft: { alignSelf: 'flex-start' },
  messageRowRight: { alignSelf: 'flex-end' },

  avatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarEmoji: { fontSize: 16 },

  bubble: {
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minWidth: 60,
  },
  bubbleAssistant: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 5,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextAssistant: { color: theme.colors.text },
  bubbleTextUser: { color: '#FFF' },

  timestamp: {
    fontSize: 10,
    marginTop: 4,
    color: theme.colors.textLight,
  },
  timestampLeft: { textAlign: 'left' },
  timestampRight: { textAlign: 'right' },

  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 50,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    ...theme.shadows.sm,
  },
  typingDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginLeft: 6,
  },

  // Input Area
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  voiceBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  voiceBtnActive: {
    backgroundColor: theme.colors.error + '20',
  },
  voiceIcon: { fontSize: 18 },
  voiceIconActive: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    maxHeight: 80,
    paddingVertical: theme.spacing.sm - 2,
    textAlignVertical: 'top',
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendBtnDisabled: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendIcon: { fontSize: 18, color: '#FFF', fontWeight: 'bold', top: -1 },
  sendIconDisabled: { fontSize: 18, color: theme.colors.textLight, fontWeight: 'bold', top: -1 },
});

// SCREEN_W 已在上方声明
