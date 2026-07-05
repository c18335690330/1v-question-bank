import { create } from 'zustand';
import type { Statistics, WrongAnswer, Question } from '../utils/types';
import { storage } from '../utils/storage';

interface StatsState {
  statistics: Statistics[];
  wrongAnswers: WrongAnswer[];
  loadStats: () => void;
  loadWrongAnswers: () => void;
  getOverallStats: () => { totalAnswered: number; correctCount: number; accuracy: number; practiceDays: number };
  getBankStats: (bankId: string) => Statistics | undefined;
  getWrongQuestions: () => Question[];
  removeFromWrong: (questionId: string) => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  statistics: [],
  wrongAnswers: [],

  loadStats: () => {
    const stats = storage.statistics.getAll();
    set({ statistics: stats });
  },

  loadWrongAnswers: () => {
    const wrong = storage.wrongAnswers.getAll();
    set({ wrongAnswers: wrong });
  },

  getOverallStats: () => {
    const { totalAnswered, correctCount, practiceDays } = storage.statistics.getOverall();
    return {
      totalAnswered,
      correctCount,
      accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
      practiceDays
    };
  },

  getBankStats: (bankId) => {
    return storage.statistics.get(bankId);
  },

  getWrongQuestions: () => {
    const wrongIds = get().wrongAnswers.map(a => a.questionId);
    const allQuestions = storage.questions.getAll();
    return allQuestions.filter(q => wrongIds.includes(q.id));
  },

  removeFromWrong: (questionId) => {
    storage.wrongAnswers.delete(questionId);
    set(state => ({
      wrongAnswers: state.wrongAnswers.filter(a => a.questionId !== questionId)
    }));
  }
}));