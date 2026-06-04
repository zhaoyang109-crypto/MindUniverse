import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

const VALID_INVITE_CODES = ['MIND2024', 'PSYCHOLOGY', 'HEALING', 'SUNSHINE', 'GROWTH'];

export default function LandingScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const shake = () => {
    setIsShaking(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => setIsShaking(false));
  };

  const handleSubmit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('请输入邀请码');
      shake();
      return;
    }
    if (VALID_INVITE_CODES.includes(trimmed)) {
      await AsyncStorage.setItem('@mind_universe_authenticated', 'true');
      onAuthenticated();
    } else {
      setError('邀请码无效，请重新输入');
      shake();
      setCode('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 顶部装饰 */}
        <View style={styles.decorDots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary, width: 8, height: 8 }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.secondary }]} />
        </View>

        <Animated.View style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}>
          {/* Logo / 主图标 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>☀️</Text>
            </View>
            <View style={styles.logoGlow} />
          </View>

          <Text style={styles.appName}>心宇宙</Text>
          <Text style={styles.appTagline}>探索内心，拥抱阳光</Text>

          {/* 邀请码输入区域 */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>请输入邀请码</Text>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={code}
                onChangeText={(text) => { setCode(text); setError(''); }}
                placeholder="输入您的邀请码"
                placeholderTextColor={theme.colors.textLight}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
            </Animated.View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={styles.submitBtnText}>进入心宇宙 →</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>如果没有邀请码，请联系管理员获取</Text>
        </Animated.View>

        {/* 底部装饰 */}
        <View style={styles.bottomDecor}>
          <Text style={styles.bottomText}>心理健康 · 从了解自己开始</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  decorDots: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    top: 60,
    right: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 60,
    backgroundColor: theme.colors.accent + '15',
  },
  appName: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  appTagline: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
  },
  inputSection: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  input: {
    width: '100%',
    height: 54,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  submitBtn: {
    width: '100%',
    height: 54,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  hint: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.lg,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 40,
  },
  bottomText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.xs,
  },
});
