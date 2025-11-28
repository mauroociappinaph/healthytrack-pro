import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type DailySummary } from '../../services/reportsService';
import { Button } from '../ui/Button';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  summary?: DailySummary;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose, date, summary }) => {
  if (!isOpen || !date) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
          data-testid="activity-modal"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {format(date, 'EEEE d', { locale: es })}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 capitalize">
                  {format(date, 'MMMM yyyy', { locale: es })}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" data-testid="modal-close-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {summary ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">Caminata</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.walkMinutes} <span className="text-sm font-normal text-gray-500">min</span></div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Ejercicio</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.exerciseMinutes} <span className="text-sm font-normal text-gray-500">min</span></div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Gym</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.gymSessions} <span className="text-sm font-normal text-gray-500">sesiones</span></div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                    <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">Calorías</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalCalories || 0} <span className="text-sm font-normal text-gray-500">kcal</span></div>
                  </div>
                </div>

                {/* Health Metrics if available */}
                {(summary.sleepHours || summary.stressLevel) && (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Salud & Bienestar</h4>
                    <div className="flex gap-4 text-sm">
                      {summary.sleepHours && (
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-500">🌙</span>
                          <span className="text-gray-700 dark:text-gray-300">{summary.sleepHours}h sueño</span>
                        </div>
                      )}
                      {summary.stressLevel && (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">🧠</span>
                          <span className="text-gray-700 dark:text-gray-300">Nivel {summary.stressLevel} estrés</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  💤
                </div>
                <p className="text-gray-500 dark:text-gray-400">No hay actividad registrada para este día.</p>
              </div>
            )}

            <div className="mt-8">
              <Button onClick={onClose} variant="secondary" className="w-full" data-testid="modal-close-button">
                Cerrar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
