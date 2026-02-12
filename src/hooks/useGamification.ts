import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import {
  getUserGamification,
  getRecentTransactions,
  getLevelFromXP,
  type UserGamification,
  type CoinTransaction,
} from '@/services/gamification.service';

export type GamificationState = {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  xpProgress: number;
  transactions: CoinTransaction[];
  loading: boolean;
  userId: string | null;
};

export const useGamification = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<UserGamification | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    if (!user?.id) {
      setData(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const [gamification, tx] = await Promise.all([
      getUserGamification(user.id),
      getRecentTransactions(user.id, 10),
    ]);
    setData(gamification ?? null);
    setTransactions(tx ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetch();
    });
    return () => subscription.unsubscribe();
  }, [fetch]);

  const totalXp = data?.total_xp ?? 0;
  const xpInLevel = totalXp % 100;

  const state: GamificationState = {
    coins: data?.coins ?? 0,
    xp: totalXp,
    level: getLevelFromXP(totalXp),
    streak: data?.streak_days ?? 0,
    xpProgress: xpInLevel / 100,
    transactions,
    loading,
    userId,
  };

  return { ...state, refresh: fetch };
};
