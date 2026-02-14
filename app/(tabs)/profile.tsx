import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { useSkin } from '@/contexts/SkinContext';
import { SKINS, type SkinName } from '@/theme/skins';
import { useGamification } from '@/hooks/useGamification';
import { useProgress } from '@/hooks/useProgress';
import { StyledTabs, type TabItem } from '@/components/ui/StyledTabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { XPBar } from '@/components/gamification/XPBar';
import { CoinsDisplay } from '@/components/gamification/CoinsDisplay';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { GDPR_TEXT, PRIVACY_POLICY_TEXT, TERMS_TEXT } from '@/content/legal';
import { signOut } from '@/services/auth.service';

const PROFILE_TABS: TabItem[] = [
  { id: 'evolutie', label: 'Evoluție' },
  { id: 'statistici', label: 'Statistici' },
  { id: 'plan', label: 'Plan studiu' },
  { id: 'setari', label: 'Setări' },
  { id: 'legal', label: 'Legal' },
];

const LEGAL_TABS: TabItem[] = [
  { id: 'gdpr', label: 'GDPR' },
  { id: 'confidentialitate', label: 'Confidențialitate' },
  { id: 'termini', label: 'Termeni' },
];

const LEGAL_CONTENT: Record<string, string> = {
  gdpr: GDPR_TEXT,
  confidentialitate: PRIVACY_POLICY_TEXT,
  termini: TERMS_TEXT,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { skin, setSkin } = useSkin();
  const { coins, level, xpProgress, streak, loading: gamLoading, userId, refresh } =
    useGamification();
  const {
    stats,
    recommendedNext,
    subjectProgress,
    recentChapters,
    loading: progressLoading,
  } = useProgress();

  const [activeTab, setActiveTab] = useState('evolutie');
  const [legalTab, setLegalTab] = useState('gdpr');

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const loading = gamLoading || progressLoading;
  const initial = userId ? 'U' : '?';

  const renderEvolutieTab = () => {
    if (!userId) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Autentifică-te pentru a vedea progresul</Text>
          <Text style={styles.emptySubtitle}>Progresul tău va fi sincronizat și salvat.</Text>
        </View>
      );
    }

    return (
      <>
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

        <GlassCard dark intensity={18} style={styles.card}>
          <Text style={styles.cardTitle}>Progres capitole</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {stats.completed} / {stats.totalChapters} completate
            </Text>
            <View style={styles.chartBarBg}>
              <View
                style={[styles.chartBarFill, { width: `${stats.completionRate * 100}%` }]}
              />
            </View>
          </View>
        </GlassCard>

        {recentChapters.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ultimele capitoluri actualizate</Text>
            {recentChapters.map((ch) => (
              <Pressable
                key={ch.id}
                onPress={() => router.push(`/chapter/${ch.id}`)}
                style={({ pressed }) => [styles.chapterRow, pressed && styles.chapterRowPressed]}
              >
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle} numberOfLines={1}>{ch.title}</Text>
                  <Text style={styles.chapterMeta}>{ch.subjectName} • {ch.status}</Text>
                </View>
                {ch.lastQuizScore != null && (
                  <Text style={styles.chapterScore}>{ch.lastQuizScore}%</Text>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderStatisticiTab = () => {
    if (!userId) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Autentifică-te pentru a vedea statisticile</Text>
        </View>
      );
    }

    const remaining = stats.totalChapters - stats.completed;

    return (
      <>
        <GlassCard dark intensity={18} style={styles.card}>
          <Text style={styles.cardTitle}>Progres pe materie</Text>
          {subjectProgress.map((sp) => (
            <View key={sp.subject.id} style={styles.subjectProgressRow}>
              <Text style={styles.subjectLabel} numberOfLines={1}>{sp.subject.name}</Text>
              <View style={styles.subjectBarWrap}>
                <View style={styles.chartBarBg}>
                  <View
                    style={[styles.chartBarFill, { width: `${sp.rate * 100}%` }]}
                  />
                </View>
                <Text style={styles.subjectValue}>{Math.round(sp.rate * 100)}%</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <GlassCard dark intensity={18} style={styles.card}>
          <Text style={styles.cardTitle}>Ce mai trebuie să înveți</Text>
          <Text style={styles.remainingCount}>{remaining} capitoluri rămase</Text>
          <View style={styles.breakdownSection}>
            {subjectProgress
              .filter((sp) => sp.completed < sp.total)
              .map((sp) => (
                <View key={sp.subject.id} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{sp.subject.name}</Text>
                  <Text style={styles.breakdownValue}>
                    {sp.total - sp.completed} restante
                  </Text>
                </View>
              ))}
          </View>
        </GlassCard>
      </>
    );
  };

  const renderPlanTab = () => {
    if (!userId) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Autentifică-te pentru planul de studiu</Text>
        </View>
      );
    }

    if (recommendedNext.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Felicitări!</Text>
          <Text style={styles.emptySubtitle}>
            Ai parcurs toate capitolele recomandate.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomandări pentru tine</Text>
        <Text style={styles.planSubtitle}>Următoarele capitole</Text>
        {recommendedNext.map((ch) => (
          <Pressable
            key={ch.id}
            onPress={() => router.push(`/chapter/${ch.id}`)}
            style={({ pressed }) => [styles.planCard, pressed && styles.chapterRowPressed]}
          >
            <GlassCard dark intensity={18} style={styles.planCardInner}>
              <Text style={styles.chapterTitle} numberOfLines={1}>{ch.title}</Text>
              <Text style={styles.chapterMeta}>{ch.subjectName}</Text>
              <Text style={styles.planArrow}>→ Începe</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  const renderSetariTab = () => (
    <View style={styles.skinSection}>
      <Text style={styles.skinTitle}>Cont</Text>
      <Text style={styles.skinSubtitle}>
        {userId ? 'Ești conectat. Progresul se salvează în cloud.' : 'Conectează-te pentru a salva progresul.'}
      </Text>
      <Pressable
        onPress={() => (userId ? handleLogout() : router.push('/login'))}
        style={({ pressed }) => [styles.authBtn, pressed && styles.authBtnPressed]}
      >
        <GlassCard dark intensity={18} style={styles.authBtnInner}>
          <Text style={styles.authBtnText}>{userId ? 'Deconectare' : 'Autentificare'}</Text>
        </GlassCard>
      </Pressable>

      <Text style={[styles.skinTitle, { marginTop: spacing.xl }]}>Temă / Skin</Text>
      <Text style={styles.skinSubtitle}>Alege fundalul aplicației</Text>
      <View style={styles.skinOptions}>
        {Object.values(SKINS).map((s) => {
          const isActive = skin === s.name;
          return (
            <Pressable
              key={s.name}
              onPress={() => setSkin(s.name)}
              style={[styles.skinOption, isActive && styles.skinOptionSelected]}
            >
              <View style={[styles.skinSwatch, { backgroundColor: s.primaryColor }]} />
              <Text style={styles.skinLabel}>{s.label}</Text>
              {isActive && (
                <View style={styles.skinBadge}>
                  <Text style={styles.skinBadgeText}>Activ</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderLegalTab = () => (
    <View style={styles.legalSection}>
      <StyledTabs tabs={LEGAL_TABS} activeId={legalTab} onChange={setLegalTab} fullWidth />
      <View style={styles.legalContent}>
        <Text style={styles.legalText}>{LEGAL_CONTENT[legalTab]}</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'evolutie':
        return renderEvolutieTab();
      case 'statistici':
        return renderStatisticiTab();
      case 'plan':
        return renderPlanTab();
      case 'setari':
        return renderSetariTab();
      case 'legal':
        return renderLegalTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Evoluție, statistici și setări.</Text>
      </View>

      <StyledTabs tabs={PROFILE_TABS} activeId={activeTab} onChange={setActiveTab} />

      {loading ? (
        <View style={[styles.centered, { minHeight: 200 }]}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
          <View style={styles.bottom} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.contentBottom,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    marginTop: spacing.sm,
  },
  streakRow: {
    marginTop: spacing.sm,
  },
  card: {
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.md,
  },
  progressRow: {
    marginTop: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginBottom: spacing.xs,
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
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  chapterRowPressed: {
    opacity: 0.9,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.text,
  },
  chapterMeta: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginTop: spacing.tight,
  },
  chapterScore: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.dark.primary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: '600',
    color: colors.dark.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    fontSize: typography.size.md,
    color: colors.dark.muted,
    textAlign: 'center',
  },
  subjectProgressRow: {
    marginBottom: spacing.md,
  },
  subjectLabel: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginBottom: spacing.xs,
  },
  subjectBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subjectValue: {
    width: 40,
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: colors.dark.text,
    textAlign: 'right',
  },
  remainingCount: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: spacing.md,
  },
  breakdownSection: {
    marginTop: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  breakdownLabel: {
    fontSize: typography.size.sm,
    color: colors.dark.text,
  },
  breakdownValue: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
  },
  planSubtitle: {
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginBottom: spacing.md,
  },
  planCard: {
    marginBottom: spacing.sm,
  },
  planCardInner: {
    padding: spacing.lg,
  },
  planArrow: {
    marginTop: spacing.sm,
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.dark.primary,
  },
  skinSection: {
    marginTop: spacing.sm,
  },
  authBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  authBtnPressed: { opacity: 0.9 },
  authBtnInner: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  authBtnText: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: '#60a5fa',
  },
  skinTitle: {
    fontSize: typography.size.lg,
    fontWeight: '600',
    color: colors.dark.text,
  },
  skinSubtitle: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    color: colors.dark.muted,
    marginBottom: spacing.md,
  },
  skinOptions: {
    gap: spacing.sm,
  },
  skinOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    marginBottom: spacing.sm,
  },
  skinOptionSelected: {
    borderColor: colors.dark.primary,
  },
  skinSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  skinLabel: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.dark.text,
  },
  skinBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.tight,
    borderRadius: 6,
  },
  skinBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  legalSection: {
    marginTop: spacing.sm,
  },
  legalContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  legalText: {
    fontSize: typography.size.sm,
    color: colors.dark.text,
    lineHeight: 22,
  },
});
