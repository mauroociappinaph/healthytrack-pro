import React from 'react';

interface GaugeProps {
  value: number; // 0-10
  label: string;
  color?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, label, color = 'primary' }) => {
  const percentage = (value / 10) * 100;

  const getColor = () => {
    if (color === 'primary') return 'text-primary-500';
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
            className={`${getColor()} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        {/* Value in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};
