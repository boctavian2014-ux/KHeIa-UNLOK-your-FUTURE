#!/usr/bin/env node
/**
 * Verifică funcționalitatea de generare capitol.
 * Apelează backend-ul direct (fallback path).
 */
const BACKEND_URL = process.env.EXPO_PUBLIC_NODE_BACKEND_URL || 'https://kheia-unlok-your-future-production.up.railway.app';
const url = BACKEND_URL.startsWith('http') ? BACKEND_URL : `https://${BACKEND_URL}`;

async function testGenerateChapter() {
  console.log('Testing /api/generate/chapter...');
  const payload = {
    topic: 'Fracții și procente',
    subject_id: 'subj-en-matematica',
    level: 'gimnaziu',
  };
  try {
    const res = await fetch(`${url}/api/generate/chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      const hasContent = data?.content && data.content.length > 0;
      console.log('OK:', res.status, hasContent ? `content length ${data.content.length}` : 'no content');
      if (data?.source === 'error') {
        console.log('Error from backend:', data.content);
        process.exit(1);
      }
      return true;
    }
    console.log('FAIL:', res.status, data);
    process.exit(1);
  } catch (e) {
    console.error('Request failed:', e.message);
    process.exit(1);
  }
}

async function testGenerateSummary() {
  console.log('Testing /api/generate/summary...');
  const payload = {
    chapter_id: 'chap-en-mate-aritmetica',
    topic: 'Aritmetică și fracții',
    summaryOnly: true,
  };
  try {
    const res = await fetch(`${url}/api/generate/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      const hasContent = data?.content && data.content.length > 0;
      console.log('OK:', res.status, hasContent ? `content length ${data.content.length}` : 'no content');
      if (data?.source === 'error') {
        console.log('Error from backend:', data.content);
        process.exit(1);
      }
      return true;
    }
    console.log('FAIL:', res.status, data);
    process.exit(1);
  } catch (e) {
    console.error('Request failed:', e.message);
    process.exit(1);
  }
}

async function main() {
  console.log('Backend URL:', url);
  await testGenerateChapter();
  await testGenerateSummary();
  console.log('All checks passed.');
}

main();
