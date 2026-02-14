import { officialExamTestsFixture } from '@/fixtures/official-tests.fixture';
import type { ExamType, OfficialExamTest } from '@/types/tests';

export function getOfficialExamTests(params?: {
  examType?: ExamType;
  year?: number;
  subjectId?: string;
}): OfficialExamTest[] {
  return officialExamTestsFixture.filter((t) => {
    if (!t.isPublic) return false;
    if (params?.examType && t.examType !== params.examType) return false;
    if (params?.year && t.year !== params.year) return false;
    if (params?.subjectId && t.subjectId !== params.subjectId) return false;
    return true;
  });
}

export function getOfficialTestById(testId: string): OfficialExamTest | null {
  return officialExamTestsFixture.find((t) => t.id === testId) ?? null;
}
