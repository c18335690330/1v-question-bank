import { Play, Trash2, BookOpen } from 'lucide-react';
import type { QuestionBank } from '../../utils/types';
import { useNavigate } from 'react-router-dom';

interface BankCardProps {
  bank: QuestionBank;
  onDelete: (id: string) => void;
}

export const BankCard = ({ bank, onDelete }: BankCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{bank.name}</h3>
          </div>
          
          {bank.description && (
            <p className="text-gray-500 text-sm mb-3">{bank.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {bank.questionCount} 道题目
            </span>
            <span>创建于 {formatDate(bank.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/practice/${bank.id}`)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">开始刷题</span>
          </button>
          <button
            onClick={() => onDelete(bank.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="删除题库"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};