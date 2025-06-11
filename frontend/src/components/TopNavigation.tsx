import React from 'react';
import { Code, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TopNavigationProps {
  onSettingsClick: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onSettingsClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Code Review
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Intelligent code analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Optional settings icon trigger */}
          {/* 
          <button onClick={onSettingsClick}>
            <Settings className="w-5 h-5" />
          </button>
          */}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
