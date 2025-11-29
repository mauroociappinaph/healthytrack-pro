/**
 * Utilities for notification-related operations
 */

/**
 * Default icons for different notification types
 */
export const NOTIFICATION_DEFAULT_ICONS = {
  achievement: '🏆',
  goal: '🎯',
  reminder: '⏰',
  alert: '⚠️',
} as const;

/**
 * Get the default icon for a notification type
 */
export const getDefaultIconForType = (type: keyof typeof NOTIFICATION_DEFAULT_ICONS): string => {
  return NOTIFICATION_DEFAULT_ICONS[type] || NOTIFICATION_DEFAULT_ICONS.alert;
};

/**
 * Create notification data structure (helper for creating notifications)
 */
export const createNotificationData = (
  userId: string,
  type: 'achievement' | 'goal' | 'reminder' | 'alert',
  title: string,
  message: string,
  icon?: string
) => {
  return {
    userId,
    type,
    title,
    message,
    icon: icon || getDefaultIconForType(type),
  };
};

/**
 * Validate notification type
 */
export const isValidNotificationType = (type: string): type is 'achievement' | 'goal' | 'reminder' | 'alert' => {
  return ['achievement', 'goal', 'reminder', 'alert'].includes(type);
};

/**
 * Check if notification data is complete
 */
export const validateNotificationData = (
  userId: string,
  type: string,
  title: string,
  message: string
): boolean => {
  return !!(
    userId &&
    typeof userId === 'string' &&
    isValidNotificationType(type) &&
    title &&
    typeof title === 'string' &&
    message &&
    typeof message === 'string'
  );
};
