import { create } from 'zustand';
import type { Question, PracticeMode, UserAnswer } from '../utils/types';
import { storage } from '../utils/storage';

interface PracticeState {
  questions: Question[];
  currentIndex: number;
  mode: PracticeMode;
  userAnswers: Record<string, string[]>;
  submittedAnswers: UserAnswer[];
  isFinished: boolean;
  startPractice: (bankId: string, mode: PracticeMode) => void;
  submitAnswer: (questionId: string, answer: string[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  checkAnswer: (questionId: string, answer: string[]) => boolean;
  getCurrentQuestion: () => Question | undefined;
  getProgress: () => { current: number; total: number; percentage: number };
  getResults: () => { correct: number; wrong: number; accuracy: number };
  resetPractice: () => void;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  mode: 'sequential',
  userAnswers: {},
  submittedAnswers: [],
  isFinished: false,

  startPractice: (bankId, mode) => {
    let questions = storage.questions.getByBankId(bankId);
    
    if (mode === 'wrong') {
      const wrongIds = storage.wrongAnswers.getAllQuestionIds();
      questions = questions.filter(q => wrongIds.includes(q.id));
    } else if (mode === 'random') {
      questions = shuffleArray(questions);
    }
    
    set({
      questions,
      currentIndex: 0,
      mode,
      userAnswers: {},
      submittedAnswers: [],
      isFinished: questions.length === 0
    });
  },

  submitAnswer: (questionId, answer) => {
    const question = get().questions.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = get().checkAnswer(questionId, answer);
    const userAnswer: UserAnswer = { questionId, answer, isCorrect };
    
    storage.statistics.update(question.bankId, isCorrect);
    
    if (!isCorrect && answer.length > 0) {
      storage.wrongAnswers.add({
        id: `wrong_${Date.now()}`,
        questionId,
        userAnswer: answer.join(', '),
        wrongDate: new Date().toISOString(),
        wrongCount: 1
      });
    } else if (isCorrect) {
      storage.wrongAnswers.delete(questionId);
    }
    
    set(state => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
      submittedAnswers: [...state.submittedAnswers, userAnswer]
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ isFinished: true });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index });
    }
  },

  checkAnswer: (questionId, answer) => {
    const question = get().questions.find(q => q.id === questionId);
    if (!question) return false;
    
    const sortedAnswer = [...answer].sort();
    const sortedCorrect = [...question.answer].sort();
    
    return JSON.stringify(sortedAnswer) === JSON.stringify(sortedCorrect);
  },

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex];
  },

  getProgress: () => {
    const { questions, currentIndex } = get();
    const total = questions.length;
    return {
      current: currentIndex + 1,
      total,
      percentage: total > 0 ? ((currentIndex + 1) / total) * 100 : 0
    };
  },

  getResults: () => {
    const { submittedAnswers } = get();
    const correct = submittedAnswers.filter(a => a.isCorrect).length;
    const wrong = submittedAnswers.filter(a => !a.isCorrect).length;
    const total = submittedAnswers.length;
    return {
      correct,
      wrong,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  },

  resetPractice: () => {
    set({
      questions: [],
      currentIndex: 0,
      mode: 'sequential',
      userAnswers: {},
      submittedAnswers: [],
      isFinished: false
    });
  }
}));