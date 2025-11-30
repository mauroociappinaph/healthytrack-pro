import React from 'react';
import { Badge } from '../../types/gamification';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  unlockedAt?: string;
}

const categoryColors = {
  consistency: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  activity: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  health: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  special: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked, unlockedAt }) => {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        unlocked
          ? 'border-yellow-400 dark:border-yellow-600 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 opacity-60'
      }`}
    >
      {/* Badge Icon */}
      <div className="flex justify-center mb-3">
        <div
          className={`text-5xl ${
            unlocked ? 'animate-pulse' : 'grayscale opacity-50'
          }`}
        >
          {badge.icon}
        </div>
      </div>

      {/* Badge Name */}
      <h3
        className={`text-center font-bold mb-2 ${
          unlocked
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {badge.name}
      </h3>

      {/* Badge Description */}
      <p
        className={`text-center text-sm mb-3 ${
          unlocked
            ? 'text-gray-600 dark:text-gray-300'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {badge.description}
      </p>

      {/* Category Tag */}
      <div className="flex justify-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[badge.category]
          }`}
        >
          {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
        </span>
      </div>

      {/* Unlocked Date */}
      {unlocked && unlockedAt && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Desbloqueado: {new Date(unlockedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-30">🔒</div>
        </div>
      )}
    </div>
  );
};
