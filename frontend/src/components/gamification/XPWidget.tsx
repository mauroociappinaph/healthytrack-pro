import React, { useEffect } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { LevelBadge } from './LevelBadge';
import { XPProgressBar } from './XPProgressBar';

export const XPWidget: React.FC = () => {
  const { progress, fetchProgress, loading } = useGamificationStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (loading || !progress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 shadow-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Tu Progreso
        </h3>
        <LevelBadge level={progress.level} size="sm" />
      </div>

      <XPProgressBar
        currentXP={progress.xp}
        xpForNextLevel={progress.xpForNextLevel || 100}
        level={progress.level}
      />

      {progress.currentStreak > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="text-xl">🔥</span>
          <span>
            <strong>{progress.currentStreak}</strong> días de racha
          </span>
        </div>
      )}
    </div>
  );
};
