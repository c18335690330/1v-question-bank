export type QuestionType = 'single' | 'multiple' | 'judge' | 'fill';

export interface Question {
  id: string;
  bankId: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string[];
  explanation?: string;
  difficulty: number;
  category?: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  createdAt: string;
  sourceFile?: string;
}

export interface WrongAnswer {
  id: string;
  questionId: string;
  userAnswer: string;
  wrongDate: string;
  wrongCount: number;
}

export interface Statistics {
  id: string;
  bankId: string;
  totalAnswered: number;
  correctCount: number;
  lastPracticeDate?: string;
}

export type PracticeMode = 'sequential' | 'random' | 'wrong';

export interface UserAnswer {
  questionId: string;
  answer: string[];
  isCorrect: boolean;
}