/**
 * SEO Generator: Extracts titles and 20% fragments from exam-content.fixture.ts
 * to generate metadata SEO. Adds CTA from website-presentation-content.txt.
 *
 * Run: npx ts-node -r dotenv/config scripts/generate-seo-metadata.ts
 */
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const require = createRequire(import.meta.url);

type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  xp: number;
  explanation: string;
};

type Quiz = {
  id: string;
  title: string;
  difficulty: string;
  examType: string;
  questions: Question[];
};

type Chapter = {
  id: string;
  name: string;
  order: number;
  quizzes: Quiz[];
};

type Subject = {
  id: string;
  name: string;
  level: string;
  examType: string;
  chapters: Chapter[];
};

type ExamFixture = {
  examType: string;
  subjects: Subject[];
};

function collectAllQuestions(fixture: ExamFixture): Array<{ subject: Subject; chapter: Chapter; quiz: Quiz; question: Question }> {
  const items: Array<{ subject: Subject; chapter: Chapter; quiz: Quiz; question: Question }> = [];
  for (const subject of fixture.subjects) {
    for (const chapter of subject.chapters) {
      for (const quiz of chapter.quizzes) {
        for (const question of quiz.questions) {
          items.push({ subject, chapter, quiz, question });
        }
      }
    }
  }
  return items;
}

function take20PercentFragments<T>(arr: T[]): T[] {
  const count = Math.max(1, Math.ceil(arr.length * 0.2));
  return arr.slice(0, count);
}

function generateFragmentText(question: Question): string {
  const parts = [question.question];
  if (question.explanation) parts.push(question.explanation);
  return parts.join('. ');
}

function loadCta(): string {
  const path = resolve(process.cwd(), 'content', 'website-presentation-content.txt');
  try {
    const content = readFileSync(path, 'utf-8');
    const ctaMatch = content.match(/CTA:\s*(.+?)(?:\n|$)/);
    return ctaMatch ? ctaMatch[1].trim() : 'Descarcă aplicația KhEIa și începe pregătirea acum!';
  } catch {
    return 'Descarcă aplicația KhEIa și începe pregătirea acum! Unlock Your Future.';
  }
}

function main() {
  const { enExamFixture, bacExamFixture } = require('../tests/fixtures/exam-content.fixture.ts') as {
    enExamFixture: ExamFixture;
    bacExamFixture: ExamFixture;
  };

  const cta = loadCta();
  const output: Array<{
    examType: string;
    subjectId: string;
    subjectName: string;
    title: string;
    description: string;
    keywords: string;
    cta: string;
  }> = [];

  for (const fixture of [enExamFixture, bacExamFixture]) {
    const examLabel = fixture.examType === 'EN' ? 'Evaluare Națională' : 'Bacalaureat';

    for (const subject of fixture.subjects) {
      const allItems = collectAllQuestions(fixture).filter((i) => i.subject.id === subject.id);
      const fragments = take20PercentFragments(allItems);
      const fragmentTexts = fragments.map((f) => generateFragmentText(f.question));
      const descriptionSnippet = fragmentTexts.join(' ').slice(0, 155) + (fragmentTexts.join(' ').length > 155 ? '...' : '');

      const keywords = [
        examLabel,
        '2026',
        subject.name,
        fixture.examType,
        subject.level,
        'pregătire',
        'quiz',
        'KhEIa',
      ].join(', ');

      output.push({
        examType: fixture.examType,
        subjectId: subject.id,
        subjectName: subject.name,
        title: `Pregătire ${subject.name} - ${examLabel} 2026 | KhEIa`,
        description: `${descriptionSnippet} ${cta}`,
        keywords,
        cta,
      });
    }
  }

  const outPath = resolve(process.cwd(), 'content', 'seo-metadata.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Generated ${output.length} SEO metadata entries -> ${outPath}`);

  const htmlSnippets = output
    .slice(0, 5)
    .map(
      (m) =>
        `<!-- ${m.subjectName} -->\n<meta name="description" content="${m.description.replace(/"/g, '&quot;')}">\n<meta name="keywords" content="${m.keywords}">\n<title>${m.title}</title>`
    )
    .join('\n\n');

  const htmlPath = resolve(process.cwd(), 'content', 'seo-meta-snippets.html');
  writeFileSync(htmlPath, `<!-- SEO meta snippets - paste into landing pages -->\n\n${htmlSnippets}\n`, 'utf-8');
  console.log(`Sample HTML snippets -> ${htmlPath}`);
}

main();
