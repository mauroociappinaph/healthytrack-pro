import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { DayCell } from './DayCell';
import { type DailySummary } from '../../services/reportsService';

interface CalendarGridProps {
  currentDate: Date;
  summaries: DailySummary[];
  onDayClick: (date: Date, summary?: DailySummary) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, summaries, onDayClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getSummaryForDate = (date: Date) => {
    return summaries.find(s => isSameDay(new Date(s.date), date));
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header Days */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 dark:bg-gray-700 gap-px">
        {days.map((day) => {
          const summary = getSummaryForDate(day);
          return (
            <DayCell
              key={day.toString()}
              date={day}
              summary={summary}
              isCurrentMonth={isSameMonth(day, monthStart)}
              isToday={isToday(day)}
              onClick={() => onDayClick(day, summary)}
            />
          );
        })}
      </div>
    </div>
  );
};
