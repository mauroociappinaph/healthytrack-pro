import React from 'react';
import { motion } from 'framer-motion';

interface WeekNavigatorProps {
  currentWeek: number;
  currentYear: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  isLoading?: boolean;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentWeek,
  currentYear,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" data-testid="week-navigator">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrevWeek}
        disabled={isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
        aria-label="Semana anterior"
        data-testid="week-nav-prev"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className="flex flex-col items-center min-w-[140px]">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Semana {currentWeek}</span>
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentYear}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextWeek}
        disabled={isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
        aria-label="Siguiente semana"
        data-testid="week-nav-next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCurrentWeek}
        disabled={isLoading}
        className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors disabled:opacity-50"
        data-testid="week-nav-today"
      >
        Hoy
      </motion.button>
    </div>
  );
};
