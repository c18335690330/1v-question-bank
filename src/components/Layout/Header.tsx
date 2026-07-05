import { BookOpen, BarChart3, BookX, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/wrong', icon: BookX, label: '错题集' },
    { path: '/stats', icon: BarChart3, label: '统计' },
  ];

  return (
    <header className="bg-primary-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-cyan-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          <nav className="flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:bg-primary-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};