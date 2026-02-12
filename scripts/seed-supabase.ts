/**
 * Seeds Supabase with data from offline JSON files.
 * Run: npm run seed
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or supabase/.env
 */
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);

// Load from root .env and supabase/.env
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), 'supabase', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seed() {
  console.log('Seeding Supabase...');

  // 1. Subjects
  const subjects = require('../assets/offline-data/subjects.json') as Array<{
    id: string;
    name: string;
    level: string;
    exam_tags: string[];
  }>;
  const { error: subErr } = await supabase.from('subjects').upsert(subjects, { onConflict: 'id' });
  if (subErr) {
    console.error('Subjects error:', subErr);
    process.exit(1);
  }
  console.log(`  subjects: ${subjects.length}`);

  // 2. Chapters
  const chapters = require('../assets/offline-data/chapters.json') as Array<{
    id: string;
    subject_id: string;
    title: string;
    order: number;
    published: boolean;
    exam_tags: string[];
    is_core_for_exam: boolean;
  }>;
  const { error: chErr } = await supabase.from('chapters').upsert(chapters, { onConflict: 'id' });
  if (chErr) {
    console.error('Chapters error:', chErr);
    process.exit(1);
  }
  console.log(`  chapters: ${chapters.length}`);

  // 3. Chapter details
  const details = require('../assets/offline-data/chapterdetails.json') as Array<{
    id: string;
    chapter_id: string;
    overview: string | null;
    sections: string[];
    keypoints: string[];
  }>;
  const detailsRows = details.map((d) => ({
    id: d.id,
    chapter_id: d.chapter_id,
    overview: d.overview ?? null,
    sections: d.sections ?? [],
    keypoints: d.keypoints ?? [],
  }));
  const { error: detErr } = await supabase.from('chapterdetails').upsert(detailsRows, {
    onConflict: 'id',
  });
  if (detErr) {
    console.error('Chapter details error:', detErr);
    process.exit(1);
  }
  console.log(`  chapterdetails: ${detailsRows.length}`);

  // 4. Practice items
  const items = require('../assets/offline-data/chapterpracticeitems.json') as Array<{
    id: string;
    chapter_id: string;
    question: string;
    explanation?: string;
    difficulty: string;
  }>;
  const itemsRows = items.map((i) => ({
    id: i.id,
    chapter_id: i.chapter_id,
    question: i.question,
    explanation: i.explanation ?? null,
    difficulty: i.difficulty ?? 'medium',
  }));
  const { error: itemErr } = await supabase.from('chapterpracticeitems').upsert(itemsRows, {
    onConflict: 'id',
  });
  if (itemErr) {
    console.error('Practice items error:', itemErr);
    process.exit(1);
  }
  console.log(`  chapterpracticeitems: ${itemsRows.length}`);

  // 5. Practice options
  const options = require('../assets/offline-data/chapterpracticeoptions.json') as Array<{
    id: string;
    practice_item_id: string;
    text: string;
    is_correct: boolean;
  }>;
  const { error: optErr } = await supabase.from('chapterpracticeoptions').upsert(options, {
    onConflict: 'id',
  });
  if (optErr) {
    console.error('Practice options error:', optErr);
    process.exit(1);
  }
  console.log(`  chapterpracticeoptions: ${options.length}`);

  console.log('Seed complete.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
