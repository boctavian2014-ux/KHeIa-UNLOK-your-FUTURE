import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { typography, spacing } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const CHAT_API = process.env.EXPO_PUBLIC_NODE_BACKEND_URL
  ? `${process.env.EXPO_PUBLIC_NODE_BACKEND_URL}/api/generate/chat`
  : null;

type Message = { role: 'user' | 'assistant'; content: string };

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TUTORIAL_STEPS = [
  'Scrie întrebarea ta aici',
  'Ex: Cum se structurează un eseu la BAC?',
  'Ex: Care este formula derivatei pentru x^n?',
  'Ex: Ce sunt genurile literare și speciile?',
  'Ex: Cum se rezolvă ecuații de gradul II?',
  'Ex: Ce este funcția referențială în comunicare?',
  'Ex: Cum se calculează probabilitatea unui eveniment?',
  'Apasă → pentru a trimite',
];

export default function KheiaScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const stepOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setTutorialDismissed(true);
      return;
    }
    let cancelled = false;
    const runStep = (index: number) => {
      if (cancelled) return;
      if (index >= TUTORIAL_STEPS.length) {
        setCurrentStepIndex(0);
        stepOpacity.setValue(0.5);
        return;
      }
      setCurrentStepIndex(index);
      stepOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(stepOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(stepOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]).start(() => {
        if (!cancelled) runStep(index + 1);
      });
    };
    runStep(0);
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => {
      cancelled = true;
      pulse.stop();
    };
  }, [messages.length]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (CHAT_API) {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const res = await fetch(CHAT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });
        const data = (await res.json()) as { content?: string };
        const content = data.content ?? 'Nu am putut primi răspuns.';
        setMessages((prev) => [...prev, { role: 'assistant', content }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Configurează EXPO_PUBLIC_NODE_BACKEND_URL în .env pentru a folosi chat-ul. Între timp, explorează materialul și teste din aplicație.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Eroare de conexiune. Verifică intern și încearcă din nou.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showFullScreenPrompt = messages.length === 0 && !loading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.title}>KhEIa</Text>
        <Text style={styles.subtitle}>Chatbot EN & Bacalaureat</Text>
      </View>

      {!showFullScreenPrompt ? (
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View
              key={i}
              style={[styles.msgRow, msg.role === 'user' ? styles.msgRowUser : styles.msgRowBot]}
            >
              <GlassCard
                dark
                intensity={msg.role === 'user' ? 12 : 16}
                style={[
                  styles.msgBubble,
                  msg.role === 'user' ? styles.msgBubbleUser : styles.msgBubbleBot,
                ]}
              >
                <Text style={styles.msgText}>{msg.content}</Text>
              </GlassCard>
            </View>
          ))}
          {loading && (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <GlassCard dark intensity={16} style={[styles.msgBubble, styles.msgBubbleBot]}>
                <ActivityIndicator size="small" color="#60a5fa" />
              </GlassCard>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.fullScreenPromptArea}>
          <Animated.View style={[styles.tutorialWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.tutorialPrompt}>
              <TextInput
                style={styles.fullScreenInput}
                placeholder=""
                placeholderTextColor="transparent"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={2000}
                editable={!loading}
              />
              {!tutorialDismissed && !input.trim() && (
                <View style={styles.tutorialSteps} pointerEvents="none">
                  <Animated.Text
                    style={[styles.tutorialStepText, { opacity: stepOpacity }]}
                  >
                    {TUTORIAL_STEPS[currentStepIndex]}
                  </Animated.Text>
                </View>
              )}
            </View>
          </Animated.View>
          <View style={styles.sendRow}>
            <Pressable
              onPress={sendMessage}
              disabled={!input.trim() || loading}
              style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed]}
            >
              <GlassCard dark intensity={14} style={styles.sendBtnInnerFull}>
                <Text style={styles.sendBtnText}>→ Trimite</Text>
              </GlassCard>
            </Pressable>
          </View>
        </View>
      )}

      {!showFullScreenPrompt && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Întreabă despre EN sau BAC..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            editable={!loading}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed]}
          >
            <GlassCard dark intensity={14} style={styles.sendBtnInner}>
              <Text style={styles.sendBtnText}>→</Text>
            </GlassCard>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: spacing.tight,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingBottom: spacing.md },
  msgRow: { marginBottom: spacing.sm },
  msgRowUser: { alignItems: 'flex-end' },
  msgRowBot: { alignItems: 'flex-start' },
  msgBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: 16,
  },
  msgBubbleUser: {
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    borderWidth: 1,
  },
  msgBubbleBot: {
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderWidth: 1,
  },
  msgText: {
    fontSize: typography.size.md,
    color: '#ffffff',
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingBottom: spacing.contentBottom,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderWidth: 1,
    borderRadius: 22,
    fontSize: typography.size.md,
    color: '#ffffff',
  },
  sendBtn: {},
  sendBtnPressed: { opacity: 0.9 },
  sendBtnInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    borderWidth: 1,
  },
  sendBtnText: { fontSize: 20, fontWeight: '700', color: '#60a5fa' },
  sendBtnInnerFull: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    borderWidth: 1,
  },
  fullScreenPromptArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.contentBottom,
  },
  tutorialWrapper: {
    flex: 1,
  },
  tutorialPrompt: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  fullScreenInput: {
    flex: 1,
    fontSize: typography.size.lg,
    color: '#ffffff',
    padding: 0,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  tutorialSteps: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  tutorialStepText: {
    fontSize: typography.size.md,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  sendRow: {
    marginTop: spacing.md,
    alignItems: 'flex-end',
  },
});
