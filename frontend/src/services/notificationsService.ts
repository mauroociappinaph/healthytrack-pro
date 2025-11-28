import { api } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'goal' | 'alert';
  title: string;
  message: string;
  icon?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/mark-all-read');
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
