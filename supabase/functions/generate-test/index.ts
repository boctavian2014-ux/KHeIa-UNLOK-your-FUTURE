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

  const backendUrl = Deno.env.get('NODE_BACKEND_URL') ?? '';
  const backendRes = await fetch(`${backendUrl}/api/generate/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await backendRes.json();

  await supabase.from('tests').insert({
    user_id: body.user_id,
    type: body.exam_type,
    subject_set: body.subjects ?? [],
    started_at: new Date().toISOString(),
  });

  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
