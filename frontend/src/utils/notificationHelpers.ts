/**
 * Frontend utilities for notification-related operations
 */

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Color classes for different notification types
 */
export const NOTIFICATION_COLOR_CLASSES = {
  achievement: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  goal: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  reminder: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  alert: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
} as const;

/**
 * Get color classes for notification type
 */
export const getNotificationColorClass = (type: string): string => {
  return NOTIFICATION_COLOR_CLASSES[type as keyof typeof NOTIFICATION_COLOR_CLASSES] || NOTIFICATION_COLOR_CLASSES.alert;
};

/**
 * Format notification timestamp to relative time
 */
export const formatNotificationTime = (createdAt: string): string => {
  try {
    return formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
      locale: es
    });
  } catch (error) {
    console.error('Error formatting notification time:', error);
    return 'Fecha desconocida';
  }
};

/**
 * Sort notifications by read status (unread first) and then by date
 */
export const sortNotificationsByReadStatus = <T extends { isRead: boolean; createdAt: string }>(notifications: T[]): T[] => {
  return [...notifications].sort((a, b) => {
    // Unread notifications first
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    // Then sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Filter notifications by type
 */
export const filterNotificationsByType = <T extends { type: string }>(
  notifications: T[],
  type: string
): T[] => {
  return notifications.filter(notification => notification.type === type);
};

/**
 * Check if notification is recent (less than 24 hours old)
 */
export const isRecentNotification = (createdAt: string): boolean => {
  const notificationDate = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);
  return diffInHours < 24;
};

/**
 * Get notification priority based on type and recency
 */
export const getNotificationPriority = (type: string, createdAt: string): 'high' | 'medium' | 'low' => {
  if (type === 'alert') return 'high';
  if (type === 'achievement' && isRecentNotification(createdAt)) return 'high';
  if (type === 'reminder') return 'medium';
  return 'low';
};
