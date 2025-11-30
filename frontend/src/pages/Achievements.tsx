import React, { useEffect, useState } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { BadgeCard } from '../gamification/BadgeCard';
import { LevelBadge } from '../gamification/LevelBadge';

export const Achievements: React.FC = () => {
  const { progress, badges, unlockedBadges, fetchProgress, fetchBadges, fetchUnlockedBadges } =
    useGamificationStore();
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchProgress();
    fetchBadges();
    fetchUnlockedBadges();
  }, [fetchProgress, fetchBadges, fetchUnlockedBadges]);

  const unlockedBadgeIds = new Set(unlockedBadges.map((ub) => ub.badgeId));

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return unlockedBadgeIds.has(badge.id);
    if (filter === 'locked') return !unlockedBadgeIds.has(badge.id);
    return badge.category === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Logros
          </h1>
          {progress && <LevelBadge level={progress.level} size="md" />}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Desbloquea badges completando desafíos y alcanzando metas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {unlockedBadges.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Badges Desbloqueados
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {badges.length - unlockedBadges.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Badges Bloqueados
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {Math.round((unlockedBadges.length / badges.length) * 100) || 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Completado
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'unlocked', 'locked', 'consistency', 'activity', 'health', 'special'].map(
          (filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => {
          const userBadge = unlockedBadges.find((ub) => ub.badgeId === badge.id);
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              unlocked={unlockedBadgeIds.has(badge.id)}
              unlockedAt={userBadge?.unlockedAt}
            />
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No hay badges en esta categoría
        </div>
      )}
    </div>
  );
};
