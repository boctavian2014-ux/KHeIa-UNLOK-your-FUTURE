import { supabase } from './supabase';

export type UserGamification = {
  user_id: string;
  coins: number;
  total_xp: number;
  streak_days: number;
  last_streak_at: string | null;
  updated_at: string;
};

export type CoinTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'redeem';
  source: string;
  source_id: string | null;
  created_at: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string | null;
  coins_cost: number;
  partner_name: string | null;
  partner_location: string | null;
  reward_type: string;
  is_active: boolean;
  image_url: string | null;
};

/**
 * Computes level from XP total.
 */
export function getLevelFromXP(totalXp: number) {
  return Math.floor((totalXp ?? 0) / 100) + 1;
}

/**
 * XP needed for next level (from current XP).
 */
export function getXPForNextLevel(totalXp: number) {
  const currentLevel = getLevelFromXP(totalXp);
  const nextLevelBase = currentLevel * 100;
  return Math.max(0, nextLevelBase - (totalXp ?? 0));
}

/**
 * Fetches user gamification data from Supabase.
 * Creates row if not exists.
 */
export async function getUserGamification(userId: string): Promise<UserGamification | null> {
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const { data: inserted } = await supabase
        .from('user_gamification')
        .insert({ user_id: userId })
        .select()
        .single();
      return inserted as UserGamification;
    }
    return null;
  }
  return data as UserGamification;
}

export type CoinSource = 'quiz' | 'test' | 'chapter' | 'daily';

/**
 * Awards coins to user and records transaction.
 * Skips if already awarded for this source+sourceId (avoids double award).
 */
export async function awardCoins(
  userId: string,
  amount: number,
  source: CoinSource,
  sourceId?: string
): Promise<{ success: boolean; newCoins?: number }> {
  if (sourceId) {
    const { data: existing } = await supabase
      .from('coin_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('source', source)
      .eq('source_id', sourceId)
      .eq('type', 'earn')
      .limit(1)
      .maybeSingle();
    if (existing) return { success: true };
  }

  const { data: row } = await supabase
    .from('user_gamification')
    .select('coins')
    .eq('user_id', userId)
    .single();

  if (!row) {
    await supabase.from('user_gamification').insert({ user_id: userId, coins: 0 });
  }

  let { data: current } = await supabase
    .from('user_gamification')
    .select('coins')
    .eq('user_id', userId)
    .single();

  if (!current) {
    const { error: ins } = await supabase
      .from('user_gamification')
      .insert({ user_id: userId, coins: amount });
    if (ins) return { success: false };
  } else {
    const newCoins = (current.coins ?? 0) + amount;
    const { error: upd } = await supabase
      .from('user_gamification')
      .update({ coins: newCoins, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (upd) return { success: false };
  }

  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount,
    type: 'earn',
    source,
    source_id: sourceId ?? null,
  });

  const { data: updated } = await supabase
    .from('user_gamification')
    .select('coins')
    .eq('user_id', userId)
    .single();

  return { success: true, newCoins: updated?.coins ?? amount };
}

/**
 * Updates streak on daily login. Awards daily coins.
 * Returns { streakDays, coinsAwarded }.
 */
export async function updateStreak(userId: string): Promise<{
  streakDays: number;
  coinsAwarded: number;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const { data: row } = await supabase
    .from('user_gamification')
    .select('streak_days, last_streak_at')
    .eq('user_id', userId)
    .single();

  if (!row) {
    await supabase.from('user_gamification').insert({
      user_id: userId,
      streak_days: 1,
      last_streak_at: today,
    });
    const coins = 2 + 1;
    await awardCoins(userId, coins, 'daily');
    return { streakDays: 1, coinsAwarded: coins };
  }

  const lastStr = row.last_streak_at as string | null;
  let newStreak = 1;
  if (lastStr) {
    const last = new Date(lastStr);
    const diff = Math.floor((new Date(today).getTime() - last.getTime()) / 86400000);
    if (diff === 0) return { streakDays: row.streak_days ?? 1, coinsAwarded: 0 };
    if (diff === 1) newStreak = (row.streak_days ?? 0) + 1;
  }

  const bonus = Math.min(newStreak - 1, 5);
  const coins = 2 + bonus;

  await supabase
    .from('user_gamification')
    .update({
      streak_days: newStreak,
      last_streak_at: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  await awardCoins(userId, coins, 'daily');

  return { streakDays: newStreak, coinsAwarded: coins };
}

/**
 * Redeems a reward. Deducts coins and creates redemption.
 */
export async function redeemReward(
  userId: string,
  rewardId: string
): Promise<{ success: boolean; voucherCode?: string; error?: string }> {
  const { data: reward } = await supabase
    .from('rewards_catalog')
    .select('*')
    .eq('id', rewardId)
    .eq('is_active', true)
    .single();

  if (!reward) return { success: false, error: 'Premiul nu există.' };

  const { data: userRow } = await supabase
    .from('user_gamification')
    .select('coins')
    .eq('user_id', userId)
    .single();

  const coins = userRow?.coins ?? 0;
  if (coins < reward.coins_cost) {
    return { success: false, error: 'Nu ai suficienți monede.' };
  }

  const voucherCode = `KH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await supabase.from('user_gamification').update({
    coins: coins - reward.coins_cost,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId);

  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount: -reward.coins_cost,
    type: 'redeem',
    source: rewardId,
    source_id: null,
  });

  await supabase.from('reward_redemptions').insert({
    user_id: userId,
    reward_id: rewardId,
    coins_spent: reward.coins_cost,
    status: 'claimed',
    voucher_code: voucherCode,
  });

  return { success: true, voucherCode };
}

/**
 * Fetches recent coin transactions.
 */
export async function getRecentTransactions(
  userId: string,
  limit = 10
): Promise<CoinTransaction[]> {
  const { data } = await supabase
    .from('coin_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as CoinTransaction[];
}

/**
 * Adds XP to user. Creates row if not exists.
 * Call from quiz/test completion – does not modify awardCoins or updateStreak.
 */
export async function addXP(
  userId: string,
  amount: number
): Promise<{ success: boolean; newTotalXp?: number }> {
  if (!userId || amount <= 0) return { success: false };

  const { data: row } = await supabase
    .from('user_gamification')
    .select('total_xp')
    .eq('user_id', userId)
    .single();

  if (!row) {
    const { error } = await supabase
      .from('user_gamification')
      .insert({ user_id: userId, total_xp: amount });
    if (error) return { success: false };
    return { success: true, newTotalXp: amount };
  }

  const newTotalXp = (row.total_xp ?? 0) + amount;
  const { error } = await supabase
    .from('user_gamification')
    .update({ total_xp: newTotalXp, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) return { success: false };
  return { success: true, newTotalXp };
}

/**
 * Helper – derives summary from UserGamification (read-only).
 */
export function getGamificationSummary(user: UserGamification) {
  const totalXP = user.total_xp ?? 0;
  const level = getLevelFromXP(totalXP);
  const xpForNextLevel = getXPForNextLevel(totalXP);

  const progressWithinLevel = totalXP % 100;
  const xpProgress = xpForNextLevel === 0 ? 1 : progressWithinLevel / 100;

  return {
    level,
    xpProgress,
    totalXP,
    coins: user.coins ?? 0,
    streak: user.streak_days ?? 0,
  };
}

/**
 * Fetches active rewards from catalog.
 */
export async function getRewardsCatalog(): Promise<Reward[]> {
  const { data } = await supabase
    .from('rewards_catalog')
    .select('*')
    .eq('is_active', true)
    .order('coins_cost', { ascending: true });
  return (data ?? []) as Reward[];
}
