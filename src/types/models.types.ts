export type ExamType = 'EN' | 'BAC';
export type EducationLevel = 'gimnaziu' | 'liceu';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  xp: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  difficulty: QuizDifficulty;
  examType: ExamType;
  questions: Question[];
};

export type Chapter = {
  id: string;
  name: string;
  order: number;
  quizzes: Quiz[];
};

export type Subject = {
  id: string;
  name: string;
  level: EducationLevel;
  examType: ExamType;
  profile?: string;
  chapters: Chapter[];
};

export type ExamContent = {
  examType: ExamType;
  subjects: Subject[];
};
