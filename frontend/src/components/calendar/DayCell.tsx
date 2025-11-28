import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { type DailySummary } from '../../services/reportsService';

interface DayCellProps {
  date: Date;
  summary?: DailySummary;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({ date, summary, isCurrentMonth, isToday, onClick }) => {
  const hasActivity = summary && (summary.walkMinutes > 0 || summary.exerciseMinutes > 0 || summary.gymSessions > 0);
  const isGoalMet = summary && (summary.walkMinutes + summary.exerciseMinutes >= 60);

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      data-testid={`calendar-day-${date.toISOString().split('T')[0]}`}
      className={`
        relative h-24 sm:h-32 border border-gray-100 dark:border-gray-800 p-2 cursor-pointer transition-colors
        ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'}
        ${isToday ? 'ring-2 ring-inset ring-primary-500 z-10' : ''}
        ${isGoalMet ? 'bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/10' : ''}
        hover:bg-gray-50 dark:hover:bg-gray-700
      `}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : ''}`}>
          {format(date, 'd')}
        </span>
        {isGoalMet && (
          <span className="text-amber-500 text-xs" title="Meta diaria alcanzada">🏆</span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1 content-start">
        {summary?.walkMinutes ? (
          <div className="w-2 h-2 rounded-full bg-green-500" title={`Caminata: ${summary.walkMinutes} min`} />
        ) : null}
        {summary?.exerciseMinutes ? (
          <div className="w-2 h-2 rounded-full bg-blue-500" title={`Ejercicio: ${summary.exerciseMinutes} min`} />
        ) : null}
        {summary?.gymSessions ? (
          <div className="w-2 h-2 rounded-full bg-purple-500" title={`Gym: ${summary.gymSessions} sesión(es)`} />
        ) : null}
      </div>

      {hasActivity && (
        <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">
          {summary.walkMinutes + summary.exerciseMinutes} min
        </div>
      )}
    </motion.div>
  );
};
