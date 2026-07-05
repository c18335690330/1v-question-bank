import { useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { WrongList } from '../components/Wrong/WrongList';
import { useStatsStore } from '../stores/statsStore';

export const WrongBook = () => {
  const { loadWrongAnswers, getWrongQuestions, removeFromWrong, wrongAnswers } = useStatsStore();

  useEffect(() => {
    loadWrongAnswers();
  }, [loadWrongAnswers]);

  const wrongQuestions = getWrongQuestions();

  const handleRemove = (questionId: string) => {
    if (confirm('确定要从错题集中移除这道题吗？')) {
      removeFromWrong(questionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="错题集" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">我的错题</h2>
          <span className="text-gray-500 text-sm">{wrongAnswers.length} 道错题</span>
        </div>
        
        <WrongList questions={wrongQuestions} onRemove={handleRemove} />
      </main>
    </div>
  );
};