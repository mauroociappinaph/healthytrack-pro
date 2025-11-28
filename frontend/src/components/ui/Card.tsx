import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
};
