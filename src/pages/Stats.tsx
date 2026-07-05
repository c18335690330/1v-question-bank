import { useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { OverallStats, StatCard } from '../components/Stats/StatCard';
import { useStatsStore } from '../stores/statsStore';
import { TrendingUp, Calendar } from 'lucide-react';

export const Stats = () => {
  const { loadStats, loadWrongAnswers, wrongAnswers, getOverallStats } = useStatsStore();

  useEffect(() => {
    loadStats();
    loadWrongAnswers();
  }, [loadStats, loadWrongAnswers]);

  const overallStats = getOverallStats();
  const accuracy = overallStats.totalAnswered > 0 
    ? Math.round((overallStats.correctCount / overallStats.totalAnswered) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="学习统计" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <OverallStats
          totalAnswered={overallStats.totalAnswered}
          correctCount={overallStats.correctCount}
          accuracy={accuracy}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <StatCard
            title="错题数量"
            value={wrongAnswers.length}
            icon={TrendingUp}
            color="yellow"
          />
          <StatCard
            title="练习天数"
            value={overallStats.practiceDays}
            icon={Calendar}
            color="purple"
          />
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">学习建议</h3>
          <div className="space-y-3">
            {accuracy < 60 && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-red-700">
                  <strong>加油！</strong> 当前正确率较低，建议多复习错题集，巩固基础知识。
                </p>
              </div>
            )}
            {accuracy >= 60 && accuracy < 80 && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-yellow-700">
                  <strong>继续努力！</strong> 正确率不错，但还有提升空间。重点关注错题，争取更高分数。
                </p>
              </div>
            )}
            {accuracy >= 80 && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-green-700">
                  <strong>做得很好！</strong> 正确率很高，保持这个状态，继续挑战更高难度的题目。
                </p>
              </div>
            )}
            {overallStats.totalAnswered === 0 && (
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-gray-600">
                  还没有开始练习，点击首页的题库开始你的学习之旅吧！
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};