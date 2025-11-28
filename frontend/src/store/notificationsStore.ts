import { create } from 'zustand';
import { notificationsService, type Notification } from '../services/notificationsService';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await notificationsService.getAll();
      set({ notifications, isLoading: false });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await notificationsService.getUnreadCount();
      set({ unreadCount });
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      const { notifications, unreadCount } = get();
      set({
        notifications: notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, unreadCount - 1),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsService.markAllAsRead();
      const { notifications } = get();
      set({
        notifications: notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationsService.delete(id);
      const { notifications } = get();
      const deletedNotification = notifications.find(n => n.id === id);
      set({
        notifications: notifications.filter(n => n.id !== id),
        unreadCount: deletedNotification && !deletedNotification.isRead
          ? Math.max(0, get().unreadCount - 1)
          : get().unreadCount,
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },
}));
