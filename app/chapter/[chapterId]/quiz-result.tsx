import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { supabase } from '@/services/supabase';
import { awardCoins } from '@/services/gamification.service';

export default function ChapterQuizResultScreen() {
  const { chapterId, correctCount } = useLocalSearchParams<{ chapterId: string; correctCount?: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!chapterId || !correctCount) return;
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;
      const correct = Math.min(10, Math.max(0, parseInt(correctCount ?? '0', 10)));
      const coins = 5 + correct;
      await awardCoins(user.id, coins, 'quiz', chapterId);
    };
    run();
  }, [chapterId, correctCount]);

  const correct = Math.min(10, Math.max(0, parseInt(correctCount ?? '0', 10)));
  const coins = 5 + correct;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezultat quiz</Text>
      <Text style={styles.score}>
        {correct} / 10 răspunsuri corecte
      </Text>
      <Text style={styles.coins}>+{coins} monede</Text>
      <Pressable
        onPress={() => router.replace(`/chapter/${chapterId}/theory`)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>← Înapoi la teorie</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  score: {
    marginTop: spacing.md,
    fontSize: typography.size.lg,
    color: colors.dark.text,
  },
  coins: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.primary,
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.secondary,
  },
});
