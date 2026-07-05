import { useEffect, useState } from 'react';
import { ArrowLeft, Shuffle, ListOrdered, BookX } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { QuestionCard } from '../components/Practice/QuestionCard';
import { ResultModal } from '../components/Practice/ResultModal';
import { usePracticeStore } from '../stores/practiceStore';
import { useBankStore } from '../stores/bankStore';
import type { PracticeMode } from '../utils/types';

export const Practice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMode, setSelectedMode] = useState<PracticeMode>(searchParams.get('mode') as PracticeMode || 'sequential');
  
  const { 
    startPractice, 
    getCurrentQuestion, 
    getProgress, 
    nextQuestion, 
    prevQuestion, 
    isFinished, 
    getResults,
    resetPractice,
    questions
  } = usePracticeStore();
  
  const { loadBanks } = useBankStore();

  useEffect(() => {
    loadBanks();
    if (id) {
      startPractice(id, selectedMode);
    }
    return () => resetPractice();
  }, [id, selectedMode]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const results = getResults();

  const modes: { value: PracticeMode; label: string; icon: typeof ListOrdered }[] = [
    { value: 'sequential', label: '顺序答题', icon: ListOrdered },
    { value: 'random', label: '随机答题', icon: Shuffle },
    { value: 'wrong', label: '错题练习', icon: BookX },
  ];

  const handleModeChange = (mode: PracticeMode) => {
    setSelectedMode(mode);
    if (id) {
      startPractice(id, mode);
    }
  };

  const handleRestart = () => {
    if (id) {
      startPractice(id, selectedMode);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="刷题模式" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </button>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">
              {questions.length === 0 
                ? '该题库暂无题目，或错题集为空' 
                : '加载中...'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="刷题模式" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </button>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {modes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.value}
                onClick={() => handleModeChange(mode.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedMode === mode.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            );
          })}
        </div>

        <QuestionCard
          question={currentQuestion}
          mode={selectedMode}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          progress={progress}
          isLast={progress.current === progress.total}
        />
      </main>

      {isFinished && (
        <ResultModal
          correct={results.correct}
          wrong={results.wrong}
          accuracy={results.accuracy}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};