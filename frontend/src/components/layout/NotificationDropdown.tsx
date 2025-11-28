import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationsStore } from '../../store/notificationsStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  } = useNotificationsStore();

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      achievement: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
      goal: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      reminder: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      alert: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    };
    return colors[type as keyof typeof colors] || colors.alert;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <span className="text-4xl mb-2 block">📭</span>
                    <p className="text-sm">No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {notifications.slice(0, 10).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                      >
                        <div className="flex items-start">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 ${getTypeColor(notification.type)}`}>
                            <span className="text-xl">{notification.icon || '📢'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full ml-2 flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: es
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
