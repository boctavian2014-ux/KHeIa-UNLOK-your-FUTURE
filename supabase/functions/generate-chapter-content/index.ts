import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase-client.ts';

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();
    const body = (await req.json()) as { topic?: string; subject_id?: string; level?: string };

    if (!body?.topic || !body?.subject_id || !body?.level) {
      return jsonResponse({ source: 'error', content: 'Lipsesc topic, subject_id sau level.' });
    }

    const hashKey = `${body.topic}:${body.subject_id}:${body.level}`;

    const { data: cached } = await supabase
      .from('ai_cache')
      .select('payload')
      .eq('hash_key', hashKey)
      .maybeSingle();

    if (cached?.payload) {
      return jsonResponse(cached.payload);
    }

    let backendUrl = (Deno.env.get('NODE_BACKEND_URL') ?? '').trim();
    if (!backendUrl) {
      return jsonResponse({ source: 'error', content: 'NODE_BACKEND_URL nu este configurat.' });
    }
    if (!backendUrl.startsWith('http')) {
      backendUrl = `https://${backendUrl}`;
    }

    const backendRes = await fetch(`${backendUrl}/api/generate/chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    let payload: unknown;
    try {
      payload = await backendRes.json();
    } catch {
      payload = { source: 'error', content: `Backend răspuns invalid: ${backendRes.status}` };
    }

    if (!backendRes.ok) {
      return jsonResponse(
        (payload as { content?: string })?.content
          ? payload
          : { source: 'error', content: `Backend: ${backendRes.status}` }
      );
    }

    const { error: insertErr } = await supabase.from('ai_cache').insert({
      hash_key: hashKey,
      payload,
      source: 'node-backend',
    });

    if (insertErr) {
      console.error('ai_cache insert failed:', insertErr);
    }

    return jsonResponse(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('generate-chapter-content error:', err);
    return jsonResponse({ source: 'error', content: `Eroare: ${msg}` });
  }
});
