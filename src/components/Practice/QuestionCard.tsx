import { useState } from 'react';
import { Circle, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';
import type { Question, PracticeMode } from '../../utils/types';
import { usePracticeStore } from '../../stores/practiceStore';

interface QuestionCardProps {
  question: Question;
  mode: PracticeMode;
  onNext: () => void;
  onPrev: () => void;
  progress: { current: number; total: number; percentage: number };
  isLast: boolean;
}

export const QuestionCard = ({ question, mode, onNext, onPrev, progress, isLast }: QuestionCardProps) => {
  const { userAnswers, submitAnswer, checkAnswer } = usePracticeStore();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userAnswers[question.id] || []);
  const [isSubmitted, setIsSubmitted] = useState(!!userAnswers[question.id]);
  const [showExplanation, setShowExplanation] = useState(false);

  const typeLabels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    fill: '填空题'
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    
    const optionKey = option.charAt(0).toUpperCase();
    
    if (question.type === 'single' || question.type === 'judge') {
      setSelectedOptions([optionKey]);
    } else {
      if (selectedOptions.includes(optionKey)) {
        setSelectedOptions(selectedOptions.filter(o => o !== optionKey));
      } else {
        setSelectedOptions([...selectedOptions, optionKey]);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    submitAnswer(question.id, selectedOptions);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (!isSubmitted) {
      handleSubmit();
    }
    onNext();
  };

  const isCorrect = isSubmitted ? checkAnswer(question.id, selectedOptions) : null;

  const getOptionStyle = (option: string) => {
    const optionKey = option.charAt(0).toUpperCase();
    const isSelected = selectedOptions.includes(optionKey);
    const isAnswer = question.answer.includes(optionKey);
    
    if (!isSubmitted) {
      return isSelected
        ? 'border-primary-500 bg-primary-50 text-primary-700'
        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50';
    }
    
    if (isAnswer) {
      return 'border-green-500 bg-green-50 text-green-700';
    }
    
    if (isSelected && !isAnswer) {
      return 'border-red-500 bg-red-50 text-red-700';
    }
    
    return 'border-gray-200 text-gray-500';
  };

  const getOptionIcon = (option: string) => {
    const optionKey = option.charAt(0).toUpperCase();
    const isSelected = selectedOptions.includes(optionKey);
    const isAnswer = question.answer.includes(optionKey);
    
    if (!isSubmitted) {
      return isSelected ? <Circle className="w-5 h-5 text-primary-600" /> : null;
    }
    
    if (isAnswer) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    
    if (isSelected && !isAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            question.type === 'single' ? 'bg-blue-100 text-blue-700' :
            question.type === 'multiple' ? 'bg-purple-100 text-purple-700' :
            question.type === 'judge' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {typeLabels[question.type]}
          </span>
          <span className="text-gray-500 text-sm">
            {progress.current} / {progress.total}
          </span>
        </div>
        
        {mode === 'wrong' && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            错题练习
          </span>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.content}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isSubmitted}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 text-left ${getOptionStyle(option)}`}
          >
            <div className="flex-shrink-0">
              {getOptionIcon(option)}
            </div>
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {isSubmitted && (
        <>
          <div className={`p-4 rounded-lg mb-4 ${
            isCorrect ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '回答正确！' : '回答错误'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                <span className="font-medium">正确答案：</span>
                {question.answer.join('、')}
              </p>
              {!isCorrect && selectedOptions.length > 0 && (
                <p className="mb-1">
                  <span className="font-medium">你的答案：</span>
                  {selectedOptions.join('、')}
                </p>
              )}
            </div>
          </div>

          {question.explanation && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="font-medium text-gray-700">解析</span>
              <ChevronRight className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
            </button>
          )}

          {showExplanation && question.explanation && (
            <div className="mt-2 p-4 bg-yellow-50 rounded-lg text-gray-700 text-sm">
              {question.explanation}
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={progress.current === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          上一题
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="px-8 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            {isLast ? '查看结果' : '下一题'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};