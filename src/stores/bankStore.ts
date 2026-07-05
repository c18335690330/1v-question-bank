import { create } from 'zustand';
import type { QuestionBank, Question } from '../utils/types';
import { storage, generateId } from '../utils/storage';
import { parseFile, parsePdfFile, detectFileType } from '../utils/parser';

interface BankState {
  banks: QuestionBank[];
  currentBank: QuestionBank | null;
  loadBanks: () => void;
  addBank: (name: string, description?: string, sourceFile?: string) => QuestionBank;
  deleteBank: (id: string) => void;
  selectBank: (id: string) => void;
  importFile: (file: File) => Promise<{ success: boolean; bank?: QuestionBank; count?: number }>;
  getBankQuestions: (bankId: string) => Question[];
}

export const useBankStore = create<BankState>((set, get) => ({
  banks: [],
  currentBank: null,

  loadBanks: () => {
    const banks = storage.banks.getAll();
    set({ banks });
  },

  addBank: (name, description, sourceFile) => {
    const bank: QuestionBank = {
      id: generateId(),
      name,
      description: description || '',
      questionCount: 0,
      createdAt: new Date().toISOString(),
      sourceFile
    };
    storage.banks.add(bank);
    set(state => ({ banks: [...state.banks, bank] }));
    return bank;
  },

  deleteBank: (id) => {
    storage.banks.delete(id);
    storage.questions.deleteByBankId(id);
    storage.wrongAnswers.saveAll(
      storage.wrongAnswers.getAll().filter(a => {
        const q = storage.questions.get(a.questionId);
        return q?.bankId !== id;
      })
    );
    set(state => ({ 
      banks: state.banks.filter(b => b.id !== id),
      currentBank: state.currentBank?.id === id ? null : state.currentBank
    }));
  },

  selectBank: (id) => {
    const bank = storage.banks.get(id);
    set({ currentBank: bank || null });
  },

  importFile: async (file) => {
    try {
      const bank = get().addBank(
        file.name.replace(/\.[^/.]+$/, ''),
        `从 ${file.name} 导入`,
        file.name
      );
      
      let questions: Question[] = [];
      const fileType = detectFileType(file.name);
      
      if (fileType === 'pdf') {
        questions = await parsePdfFile(file, bank.id);
      } else {
        const content = await file.text();
        questions = parseFile(content, file.name, bank.id);
      }
      
      if (questions.length === 0) {
        get().deleteBank(bank.id);
        return { success: false };
      }
      
      storage.questions.addAll(questions);
      
      bank.questionCount = questions.length;
      storage.banks.update(bank);
      
      set(state => ({
        banks: state.banks.map(b => b.id === bank.id ? bank : b),
        currentBank: bank
      }));
      
      return { success: true, bank, count: questions.length };
    } catch {
      return { success: false };
    }
  },

  getBankQuestions: (bankId) => {
    return storage.questions.getByBankId(bankId);
  }
}));