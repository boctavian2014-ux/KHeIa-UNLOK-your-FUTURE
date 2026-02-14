export type ExamType = 'EN' | 'BAC';

export type OfficialSession =
  | 'simulare'
  | 'examen'
  | 'antrenament'
  | 'model';

export type OfficialExamTest = {
  id: string;
  examType: ExamType;
  year: number;
  session: OfficialSession;
  subjectId: string;
  title: string;
  sourceUrl?: string;
  variant?: string;
  isPublic: boolean;
};

export type TestSourceType = 'GENERATED' | 'OFFICIAL_EN' | 'OFFICIAL_BAC';

export type TestMeta = {
  id: string;
  sourceType: TestSourceType;
  official?: OfficialExamTest;
};
