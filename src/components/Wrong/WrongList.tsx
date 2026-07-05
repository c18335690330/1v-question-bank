import { Trash2, BookOpen, RefreshCw } from 'lucide-react';
import type { Question } from '../../utils/types';
import { useNavigate } from 'react-router-dom';

interface WrongListProps {
  questions: Question[];
  onRemove: (questionId: string) => void;
}

export const WrongList = ({ questions, onRemove }: WrongListProps) => {
  const navigate = useNavigate();

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">太棒了！</h3>
        <p className="text-gray-500">暂无错题，继续保持！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(question => (
        <div
          key={question.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  question.type === 'single' ? 'bg-blue-100 text-blue-700' :
                  question.type === 'multiple' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {question.type === 'single' ? '单选' : question.type === 'multiple' ? '多选' : '判断'}
                </span>
                {question.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {question.category}
                  </span>
                )}
              </div>
              
              <p className="text-gray-800 font-medium line-clamp-2 mb-2">
                {question.content}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>正确答案：{question.answer.join('、')}</span>
                {question.options && (
                  <span>共 {question.options.length} 个选项</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/practice/${question.bankId}?mode=wrong`)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">重新练习</span>
              </button>
              <button
                onClick={() => onRemove(question.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="从错题集移除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};