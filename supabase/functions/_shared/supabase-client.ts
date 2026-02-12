import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const getSupabaseClient = (jwt?: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = jwt ? Deno.env.get('SUPABASE_ANON_KEY') ?? '' : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  return createClient(supabaseUrl, supabaseKey, {
    global: jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined,
  });
};
