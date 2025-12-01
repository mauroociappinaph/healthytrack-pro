import React from 'react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const getLevelColor = (level: number): string => {
  if (level <= 5) return 'text-gray-600 dark:text-gray-400'; // Novato
  if (level <= 10) return 'text-green-600 dark:text-green-400'; // Aprendiz
  if (level <= 15) return 'text-blue-600 dark:text-blue-400'; // Experto
  if (level <= 20) return 'text-purple-600 dark:text-purple-400'; // Maestro
  return 'text-yellow-600 dark:text-yellow-400'; // Leyenda
};

const getLevelTitle = (level: number): string => {
  if (level <= 5) return 'Novato';
  if (level <= 10) return 'Aprendiz';
  if (level <= 15) return 'Experto';
  if (level <= 20) return 'Maestro';
  return 'Leyenda';
};

const sizeClasses = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-base',
  lg: 'w-20 h-20 text-lg',
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md' }) => {
  const colorClass = getLevelColor(level);
  const title = getLevelTitle(level);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClasses[size]} rounded-full border-4 ${colorClass} border-current flex items-center justify-center font-bold bg-white dark:bg-gray-800 shadow-lg`}
        title={title}
      >
        {level}
      </div>
      <span className={`text-xs font-medium ${colorClass}`}>{title}</span>
    </div>
  );
};
