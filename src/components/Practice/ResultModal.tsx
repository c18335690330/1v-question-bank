import { Trophy, Target, XCircle, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultModalProps {
  correct: number;
  wrong: number;
  accuracy: number;
  onRestart: () => void;
}

export const ResultModal = ({ correct, wrong, accuracy, onRestart }: ResultModalProps) => {
  const navigate = useNavigate();

  const getGrade = () => {
    if (accuracy >= 90) return { text: '优秀', color: 'text-green-600', bg: 'bg-green-50' };
    if (accuracy >= 70) return { text: '良好', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (accuracy >= 60) return { text: '及格', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: '需努力', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const grade = getGrade();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${grade.bg} flex items-center justify-center`}>
            <Trophy className={`w-10 h-10 ${grade.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">答题完成！</h2>
          <p className={`text-lg font-semibold ${grade.color}`}>{grade.text}</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{correct}</div>
            <div className="text-sm text-gray-500">正确</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{wrong}</div>
            <div className="text-sm text-gray-500">错误</div>
          </div>
          
          <div className="text-center p-4 bg-primary-50 rounded-xl">
            <div className="text-2xl font-bold text-primary-600">{accuracy}%</div>
            <div className="text-sm text-gray-500">正确率</div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            再练一次
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};