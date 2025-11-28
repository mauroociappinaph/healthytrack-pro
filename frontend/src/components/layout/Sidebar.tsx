import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/activity-hub', label: 'Actividad', icon: '⚡' },
    { path: '/reports', label: 'Reportes', icon: '📈' },
    { path: '/calendar', label: 'Calendario', icon: '📅' },
    { icon: '👤', label: 'Perfil', path: '/profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-white dark:bg-gray-900 w-64 min-h-screen flex-shrink-0 border-r border-gray-100 dark:border-gray-800 hidden md:block transition-colors">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">HealthyTrack</h1>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.path.replace('/', '')}`}
                className={`flex items-center px-6 py-3.5 rounded-full transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <span className={`mr-3 text-lg ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-8">
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-4 text-center border border-primary-100 dark:border-primary-800">
            <p className="text-primary-700 dark:text-primary-300 font-semibold text-sm mb-1">Plan Pro</p>
            <p className="text-primary-500 dark:text-primary-400 text-xs mb-3">Acceso total desbloqueado</p>
            <button className="bg-primary-600 dark:bg-primary-500 text-white text-xs font-medium px-4 py-2 rounded-full w-full hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
              Ver detalles
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">HealthyTrack</h1>
              </div>

              <nav className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-6 py-3.5 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
