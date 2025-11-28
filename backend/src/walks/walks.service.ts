import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalkDto, UpdateWalkDto } from './dto/walk.dto';

@Injectable()
export class WalksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWalkDto) {
    return this.prisma.walk.create({
      data: {
        userId,
        duration: dto.duration,
        distance: dto.distance,
        intensity: dto.intensity,
        date: dto.date || new Date(),
        notes: dto.notes,
      },
    });
  }

  async findAll(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.walk.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.walk.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateWalkDto) {
    return this.prisma.walk.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.walk.deleteMany({
      where: { id, userId },
    });
  }

  async getStats(userId: string, startDate?: Date, endDate?: Date) {
    const walks = await this.findAll(userId, startDate, endDate);

    const totalMinutes = walks.reduce((sum, walk) => sum + walk.duration, 0);
    const totalDistance = walks.reduce((sum, walk) => sum + (walk.distance || 0), 0);

    return {
      total: walks.length,
      totalMinutes,
      totalDistance,
      avgDuration: walks.length > 0 ? totalMinutes / walks.length : 0,
      avgDistance: walks.length > 0 ? totalDistance / walks.length : 0,
    };
  }
}
