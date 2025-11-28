import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: '📊' },
    { path: '/activity-hub', label: 'Actividad', icon: '⚡' },
    { path: '/reports', label: 'Reportes', icon: '📈' },
  ];

  return (
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-inset-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <motion.div
                className={`flex flex-col items-center ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-600 dark:bg-primary-400 rounded-b-full"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
