import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 transition-colors">
      {/* Left side - Title (hidden on mobile when menu is present) */}
      <div className="ml-12 md:ml-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">Mi Dashboard</h2>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        {/* User Profile */}
        <div className="flex items-center pl-3 md:pl-6 border-l border-gray-100 dark:border-gray-800">
          {/* User name - Hidden on mobile */}
          <div className="text-right mr-3 hidden md:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Usuario</p>
          </div>

          <div className="relative group">
            <button
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold border-2 border-white dark:border-gray-900 shadow-sm"
              data-testid="user-menu-button"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="p-2">
                {/* User info on mobile */}
                <div className="md:hidden px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center"
                  data-testid="logout-button"
                >
                  <span className="mr-2">🚪</span> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
