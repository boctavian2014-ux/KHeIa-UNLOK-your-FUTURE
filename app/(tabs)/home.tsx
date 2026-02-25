import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCatalogContext } from '@/components/common/CatalogProvider';
import { useGamification } from '@/hooks/useGamification';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { CoinsDisplay } from '@/components/gamification/CoinsDisplay';
import { DailyMission } from '@/components/gamification/DailyMission';
import { RecentActivity } from '@/components/gamification/RecentActivity';
import { ExamCountdownDual } from '@/components/gamification/ExamCountdown';
import { generateDailyMissions } from '@/services/daily-missions.client';
import { getOnboardingExam } from '@/lib/onboardingStorage';

const kheiaIcon = require('../../assets/KHEIA ICON.png');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'progress'>('welcome');
  const [examContext, setExamContext] = useState<'EN' | 'BAC' | 'ANY'>('ANY');
  const { subjects, loading } = useCatalogContext();
  const { coins, level, xpProgress, streak, transactions, loading: gamLoading, userId, refresh } =
    useGamification();

  useEffect(() => {
    getOnboardingExam().then((exam) => {
      if (exam) setExamContext(exam);
    });
  }, []);

  const missions = useMemo(
    () => generateDailyMissions(streak, transactions, examContext),
    [streak, transactions, examContext]
  );

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );


  const formatTags = (subject: { level: string; exam_tags: string[] }) => {
    const tags = subject.exam_tags ?? [];
    const exam = tags.includes('BAC') ? 'BAC' : 'EN';
    const profiles = tags.filter((tag) => tag === 'real' || tag === 'uman');
    const profile = profiles.length > 0 ? profiles.join('/') : undefined;
    return [exam, profile, subject.level].filter(Boolean).join(' · ');
  };

  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('rom')) return '📚';
    if (lower.includes('mat')) return '🧮';
    if (lower.includes('istor')) return '🏺';
    if (lower.includes('fiz')) return '⚡';
    if (lower.includes('chim')) return '🧪';
    if (lower.includes('biol') || lower.includes('anatom')) return '🧬';
    if (lower.includes('informatic')) return '💻';
    if (lower.includes('geograf')) return '🗺️';
    if (lower.includes('logic')) return '🧩';
    if (lower.includes('psiholog')) return '🧠';
    if (lower.includes('econom')) return '💰';
    if (lower.includes('sociolog')) return '👥';
    if (lower.includes('filosof')) return '💭';
    return '📘';
  };

  const examSections = [
    { key: 'EN', title: 'Evaluare Națională' },
    { key: 'BAC', title: 'Bacalaureat' },
  ];

  const getSubjectsByExam = (exam: 'EN' | 'BAC') =>
    subjects.filter((subject) => (subject.exam_tags ?? []).includes(exam));

  const enCount = getSubjectsByExam('EN').length;
  const bacCount = getSubjectsByExam('BAC').length;
  const maxCount = Math.max(enCount, bacCount, 1);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  const initial = userId ? 'U' : '?';

  return (
    <View style={styles.container}>
      <View style={[styles.topTabs, { marginTop: insets.top + spacing.md }]}>
        <Pressable
          onPress={() => setActiveTab('welcome')}
          style={[styles.topTab, activeTab === 'welcome' && styles.topTabActive]}
        >
          <Text style={[styles.topTabText, activeTab === 'welcome' && styles.topTabTextActive]}>
            Welcome
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('progress')}
          style={[styles.topTab, activeTab === 'progress' && styles.topTabActive]}
        >
          <Text style={[styles.topTabText, activeTab === 'progress' && styles.topTabTextActive]}>
            Progres
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'welcome' ? (
          <>
            <View style={styles.hero}>
              <Image source={kheiaIcon} style={styles.heroIcon} resizeMode="contain" />
              <Text style={styles.heroTitle}>Unlock Your Future</Text>
              <Text style={styles.heroSubtitle}>Antrenorul tău pentru EN & Bac</Text>
              <Text style={styles.heroBody}>Alege o materie și începe antrenamentul.</Text>

              <View style={styles.countdownWrap}>
                <ExamCountdownDual />
              </View>

              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Materii disponibile</Text>
                <View style={styles.chartRow}>
                  <Text style={styles.chartLabel}>Evaluare Națională</Text>
                  <View style={styles.chartBarBg}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { width: `${(enCount / maxCount) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartValue}>{enCount}</Text>
                </View>
                <View style={[styles.chartRow, { marginBottom: 0 }]}>
                  <Text style={styles.chartLabel}>Bacalaureat</Text>
                  <View style={styles.chartBarBg}>
                    <View
                      style={[
                        styles.chartBarFill,
                        styles.chartBarFillAlt,
                        { width: `${(bacCount / maxCount) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartValue}>{bacCount}</Text>
                </View>
              </View>

              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Progresul tău</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{level}</Text>
                    <Text style={styles.statLabel}>Nivel</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{coins}</Text>
                    <Text style={styles.statLabel}>Monede</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{streak}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                  </View>
                </View>
                <View style={styles.xpBarWrap}>
                  <View style={styles.chartBarBg}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { width: `${Math.min(100, xpProgress * 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.xpBarLabel}>XP până la nivelul următor</Text>
                </View>
              </View>
            </View>

            {examSections.map((exam) => {
              const examSubjects = getSubjectsByExam(exam.key as 'EN' | 'BAC');
              if (examSubjects.length === 0) return null;
              return (
                <View key={exam.key} style={styles.examSection}>
                  <Text style={styles.examHeading}>{exam.title}</Text>
                  <View style={styles.subjectGrid}>
                    {examSubjects.map((subject) => (
                      <Pressable
                        key={subject.id}
                        onPress={() => router.push(`/subject/${subject.id}`)}
                        style={({ pressed }) => [styles.subjectCardWrap, pressed && styles.subjectCardPressed]}
                      >
                        <GlassCard dark intensity={18} style={styles.subjectCard}>
                          <View style={styles.subjectHeader}>
                            <Text style={styles.subjectIcon}>{getSubjectIcon(subject.name)}</Text>
                            <View style={styles.subjectText}>
                              <Text style={styles.cardTitle} numberOfLines={1}>{subject.name}</Text>
                              <Text style={styles.cardMeta} numberOfLines={1}>{formatTags(subject)}</Text>
                            </View>
                            <Text style={styles.subjectArrow}>→</Text>
                          </View>
                        </GlassCard>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        ) : gamLoading ? (
          <View style={[styles.progressContent, styles.centered, { minHeight: 200 }]}>
            <ActivityIndicator size="large" color={colors.dark.primary} />
          </View>
        ) : (
          <View style={styles.progressContent}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.level}>Nivel {level}</Text>
                <XPBar progress={xpProgress} />
              </View>
            </View>
            <View style={styles.coinsRow}>
              <CoinsDisplay coins={coins} />
            </View>
            <View style={styles.streakRow}>
              <StreakCounter streak={streak} />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Misiuni zilnice</Text>
              {missions.map((m) => (
                <View key={m.id} style={styles.missionWrap}>
                  <DailyMission text={m.text} />
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ultimele activități</Text>
              <RecentActivity transactions={transactions} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topTabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 16,
    padding: spacing.sm,
  },
  topTab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
  },
  topTabActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
  },
  topTabText: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.muted,
  },
  topTabTextActive: {
    color: colors.dark.text,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.contentBottom,
  },
  progressContent: {
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    flex: 1,
    marginLeft: spacing.md,
  },
  level: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: spacing.xs,
  },
  coinsRow: {
    marginTop: spacing.md,
  },
  streakRow: {
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  missionWrap: {
    marginBottom: spacing.sm,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 72,
    height: 72,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.lg,
    color: colors.dark.muted,
    textAlign: 'center',
  },
  heroBody: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.text,
    textAlign: 'center',
  },
  countdownWrap: {
    marginTop: spacing.lg,
    width: '100%',
  },
  chartCard: {
    marginTop: spacing.xl,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  chartTitle: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  chartLabel: {
    width: 120,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  chartBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 5,
  },
  chartBarFillAlt: {
    backgroundColor: colors.dark.secondary,
  },
  chartValue: {
    width: 28,
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.dark.muted,
    marginTop: spacing.tight,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
  xpBarWrap: {
    marginTop: spacing.sm,
  },
  xpBarLabel: {
    fontSize: typography.size.xs,
    color: colors.dark.muted,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.dark.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
  },
  body: {
    marginTop: spacing.md,
    fontSize: typography.size.md,
    color: colors.dark.text,
  },
  examSection: {
    marginTop: spacing.xl,
  },
  examHeading: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.md,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  subjectCardWrap: {
    width: '48%',
    flexGrow: 0,
  },
  subjectCardPressed: {
    opacity: 0.9,
  },
  subjectCard: {
    backgroundColor: 'rgba(2, 6, 23, 0.65)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIcon: {
    fontSize: 12,
    marginRight: spacing.sm,
  },
  subjectText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.text,
  },
  cardMeta: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  subjectArrow: {
    fontSize: typography.size.lg,
    color: colors.dark.muted,
  },
});
