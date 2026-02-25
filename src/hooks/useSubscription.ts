import { useState, useCallback, useEffect } from 'react';
import { getSubscriptionStatus, type SubscriptionStatus } from '@/services/subscription.service';
import { supabase } from '@/services/supabase';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const s = await getSubscriptionStatus(user?.id ?? null);
    setStatus(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    isPremium: status?.isPremium ?? false,
    planType: status?.planType ?? 'free',
    status,
    loading,
    refresh,
    needsPaywall: status && !status.isPremium,
  };
}
