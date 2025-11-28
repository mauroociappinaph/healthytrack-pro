import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangle',
  width = 'w-full',
  height = 'h-4',
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

  const variantClasses = {
    card: 'rounded-2xl h-32',
    text: 'rounded h-4',
    circle: 'rounded-full',
    rectangle: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`}
      style={{
        animation: 'shimmer 2s infinite linear'
      }}
    />
  );
};

// Skeleton para tarjetas del Dashboard
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <SkeletonLoader variant="text" width="w-1/3" className="mb-2" />
    <SkeletonLoader variant="text" width="w-1/2" height="h-8" className="mb-4" />
    <SkeletonLoader variant="text" width="w-2/3" />
  </div>
);

// Skeleton para gráficos circulares
export const CircleChartSkeleton: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <SkeletonLoader variant="circle" width="w-48" height="h-48" />
  </div>
);
