import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeExerciseDto, UpdateHomeExerciseDto } from './dto/home-exercise.dto';

@Injectable()
export class HomeExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateHomeExerciseDto) {
    return this.prisma.homeExercise.create({
      data: {
        userId,
        type: dto.type,
        duration: dto.duration,
        level: dto.level,
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

    return this.prisma.homeExercise.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.homeExercise.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateHomeExerciseDto) {
    return this.prisma.homeExercise.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.homeExercise.deleteMany({
      where: { id, userId },
    });
  }

  async getStats(userId: string, startDate?: Date, endDate?: Date) {
    const exercises = await this.findAll(userId, startDate, endDate);
    const totalMinutes = exercises.reduce((sum, ex) => sum + ex.duration, 0);

    return {
      total: exercises.length,
      totalMinutes,
      byType: exercises.reduce((acc, ex) => {
        acc[ex.type] = (acc[ex.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
