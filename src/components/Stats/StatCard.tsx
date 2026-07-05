import { Target, TrendingUp, Award } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: typeof Target;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

export const StatCard = ({ title, value, subValue, icon: Icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className={`text-2xl font-bold ${classes.textColor}`}>{value}</p>
          {subValue && <p className="text-gray-400 text-xs mt-1">{subValue}</p>}
        </div>
        <div className={`${classes.iconBg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${classes.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

interface AccuracyRingProps {
  accuracy: number;
  size?: number;
}

export const AccuracyRing = ({ accuracy, size = 120 }: AccuracyRingProps) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={45}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={45}
          fill="none"
          stroke={accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${
          accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {accuracy}%
        </span>
        <span className="text-gray-400 text-sm">正确率</span>
      </div>
    </div>
  );
};

export const OverallStats = ({ totalAnswered, correctCount, accuracy }: { totalAnswered: number; correctCount: number; accuracy: number }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">总体统计</h3>
      
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <AccuracyRing accuracy={accuracy} />
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          <StatCard
            title="总答题数"
            value={totalAnswered}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="正确数"
            value={correctCount}
            icon={Award}
            color="green"
          />
          <StatCard
            title="错误数"
            value={totalAnswered - correctCount}
            icon={TrendingUp}
            color="yellow"
          />
        </div>
      </div>
    </div>
  );
};