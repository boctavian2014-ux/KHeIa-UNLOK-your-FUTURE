import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase-client.ts';
import { getJwtFromRequest } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const jwt = getJwtFromRequest(req);
  const supabase = getSupabaseClient(jwt);
  const body = await req.json();
  const hashKey = `${body.topic}:${body.subject_id}:${body.level}`;

  const { data: cached } = await supabase
    .from('ai_cache')
    .select('payload')
    .eq('hash_key', hashKey)
    .maybeSingle();

  if (cached?.payload) {
    return new Response(JSON.stringify(cached.payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  const backendUrl = Deno.env.get('NODE_BACKEND_URL') ?? '';
  const backendRes = await fetch(`${backendUrl}/api/generate/chapter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await backendRes.json();

  await supabase.from('ai_cache').insert({
    hash_key: hashKey,
    payload,
    source: 'node-backend',
  });

  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
