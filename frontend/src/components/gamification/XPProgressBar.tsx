import React from 'react';

interface XPProgressBarProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
}

const getLevelColor = (level: number): string => {
  if (level <= 5) return 'bg-gray-500'; // Novato
  if (level <= 10) return 'bg-green-500'; // Aprendiz
  if (level <= 15) return 'bg-blue-500'; // Experto
  if (level <= 20) return 'bg-purple-500'; // Maestro
  return 'bg-yellow-500'; // Leyenda
};

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  xpForNextLevel,
  level,
}) => {
  const percentage = Math.min((currentXP / xpForNextLevel) * 100, 100);
  const colorClass = getLevelColor(level);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          XP Progress
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {currentXP} / {xpForNextLevel}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && (
            <span className="text-xs font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
