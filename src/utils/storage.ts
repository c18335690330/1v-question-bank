import type { QuestionBank, Question, WrongAnswer, Statistics } from './types';

const BANKS_KEY = 'question_banks';
const QUESTIONS_KEY = 'questions';
const WRONG_KEY = 'wrong_answers';
const STATS_KEY = 'statistics';

export const storage = {
  banks: {
    getAll(): QuestionBank[] {
      const data = localStorage.getItem(BANKS_KEY);
      return data ? JSON.parse(data) : [];
    },
    saveAll(banks: QuestionBank[]): void {
      localStorage.setItem(BANKS_KEY, JSON.stringify(banks));
    },
    add(bank: QuestionBank): void {
      const banks = this.getAll();
      banks.push(bank);
      this.saveAll(banks);
    },
    delete(id: string): void {
      const banks = this.getAll().filter(b => b.id !== id);
      this.saveAll(banks);
    },
    get(id: string): QuestionBank | undefined {
      return this.getAll().find(b => b.id === id);
    },
    update(bank: QuestionBank): void {
      const banks = this.getAll();
      const index = banks.findIndex(b => b.id === bank.id);
      if (index !== -1) {
        banks[index] = bank;
        this.saveAll(banks);
      }
    }
  },
  questions: {
    getAll(): Question[] {
      const data = localStorage.getItem(QUESTIONS_KEY);
      return data ? JSON.parse(data) : [];
    },
    saveAll(questions: Question[]): void {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    },
    addAll(questions: Question[]): void {
      const all = this.getAll();
      all.push(...questions);
      this.saveAll(all);
    },
    getByBankId(bankId: string): Question[] {
      return this.getAll().filter(q => q.bankId === bankId);
    },
    deleteByBankId(bankId: string): void {
      const questions = this.getAll().filter(q => q.bankId !== bankId);
      this.saveAll(questions);
    },
    get(id: string): Question | undefined {
      return this.getAll().find(q => q.id === id);
    }
  },
  wrongAnswers: {
    getAll(): WrongAnswer[] {
      const data = localStorage.getItem(WRONG_KEY);
      return data ? JSON.parse(data) : [];
    },
    saveAll(answers: WrongAnswer[]): void {
      localStorage.setItem(WRONG_KEY, JSON.stringify(answers));
    },
    add(answer: WrongAnswer): void {
      const answers = this.getAll();
      const existing = answers.find(a => a.questionId === answer.questionId);
      if (existing) {
        existing.wrongCount += 1;
        existing.wrongDate = answer.wrongDate;
        existing.userAnswer = answer.userAnswer;
      } else {
        answers.push(answer);
      }
      this.saveAll(answers);
    },
    delete(questionId: string): void {
      const answers = this.getAll().filter(a => a.questionId !== questionId);
      this.saveAll(answers);
    },
    get(questionId: string): WrongAnswer | undefined {
      return this.getAll().find(a => a.questionId === questionId);
    },
    getAllQuestionIds(): string[] {
      return this.getAll().map(a => a.questionId);
    }
  },
  statistics: {
    getAll(): Statistics[] {
      const data = localStorage.getItem(STATS_KEY);
      return data ? JSON.parse(data) : [];
    },
    saveAll(stats: Statistics[]): void {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    },
    update(bankId: string, isCorrect: boolean): void {
      const stats = this.getAll();
      let existing = stats.find(s => s.bankId === bankId);
      if (!existing) {
        existing = {
          id: `stats_${Date.now()}`,
          bankId,
          totalAnswered: 0,
          correctCount: 0
        };
        stats.push(existing);
      }
      existing.totalAnswered += 1;
      if (isCorrect) {
        existing.correctCount += 1;
      }
      existing.lastPracticeDate = new Date().toISOString();
      this.saveAll(stats);
    },
    get(bankId: string): Statistics | undefined {
      return this.getAll().find(s => s.bankId === bankId);
    },
    getOverall(): { totalAnswered: number; correctCount: number; practiceDays: number } {
      const all = this.getAll();
      const practiceDays = new Set(
        all.filter(s => s.lastPracticeDate)
          .map(s => s.lastPracticeDate!.split('T')[0])
      ).size;
      return all.reduce(
        (acc, s) => ({
          totalAnswered: acc.totalAnswered + s.totalAnswered,
          correctCount: acc.correctCount + s.correctCount,
          practiceDays
        }),
        { totalAnswered: 0, correctCount: 0, practiceDays }
      );
    }
  }
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};