import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { createNotificationData, getDefaultIconForType } from '../common/utils';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.notification.delete({
      where: { id, userId },
    });
  }

  // Helper method to create achievement notifications
  async createAchievementNotification(
    userId: string,
    title: string,
    message: string,
    icon?: string
  ) {
    const data = createNotificationData(userId, 'achievement', title, message, icon);
    return this.create(data);
  }

  // Helper method to create goal notifications
  async createGoalNotification(
    userId: string,
    title: string,
    message: string,
    icon?: string
  ) {
    const data = createNotificationData(userId, 'goal', title, message, icon);
    return this.create(data);
  }

  // Helper method to create reminder notifications
  async createReminderNotification(
    userId: string,
    title: string,
    message: string,
    icon?: string
  ) {
    const data = createNotificationData(userId, 'reminder', title, message, icon);
    return this.create(data);
  }
}
