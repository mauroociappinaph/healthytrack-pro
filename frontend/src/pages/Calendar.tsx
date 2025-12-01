import React, { useState, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { ActivityDetailModal } from '../components/calendar/ActivityDetailModal';
import { reportsService, type DailySummary } from '../services/reportsService';
import { Button } from '../components/ui/Button';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<DailySummary | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMonthlyData = async () => {
    setIsLoading(true);
    try {
      const month = currentDate.getMonth() + 1; // 1-indexed for backend
      const year = currentDate.getFullYear();
      const data = await reportsService.getMonthlySummaries(month, year);
      setSummaries(data);
    } catch (error) {
      console.error('Error fetching monthly summaries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData, currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date, summary?: DailySummary) => {
    setSelectedDate(date);
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize" data-testid="calendar-title">
              {currentDate.toLocaleString('es', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Historial de actividad mensual
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handlePrevMonth} className="!p-2" data-testid="calendar-prev-month">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="secondary" onClick={handleToday} data-testid="calendar-today">
              Hoy
            </Button>
            <Button variant="secondary" onClick={handleNextMonth} className="!p-2" data-testid="calendar-next-month">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 px-2" data-testid="calendar-legend">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Caminata</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Ejercicio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Gimnasio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500">🏆</span>
            <span>Meta Diaria (60+ min)</span>
          </div>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            summaries={summaries}
            onDayClick={handleDayClick}
          />
        )}

        <ActivityDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          summary={selectedSummary}
        />
      </div>
    </div>
  );
};
