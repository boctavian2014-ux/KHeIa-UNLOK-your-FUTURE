import { useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { updateStreak } from '@/services/gamification.service';

/**
 * On app open and auth changes, updates streak and awards daily coins.
 * Mount once in root layout.
 */
export const StreakUpdater = () => {
  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        await updateStreak(user.id);
      }
    };
    run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      run();
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
};
