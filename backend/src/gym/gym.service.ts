import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGymSessionDto,
  UpdateGymSessionDto,
  CreateGymExerciseDto,
  UpdateGymExerciseDto,
} from './dto/gym.dto';

@Injectable()
export class GymService {
  constructor(private prisma: PrismaService) {}

  // ========== SESSIONS ==========
  async createSession(userId: string, dto: CreateGymSessionDto) {
    return this.prisma.gymSession.create({
      data: {
        userId,
        name: dto.name,
        date: dto.date || new Date(),
        duration: dto.duration,
        notes: dto.notes,
      },
    });
  }

  async findAllSessions(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.gymSession.findMany({
      where,
      include: { exercises: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOneSession(id: string, userId: string) {
    return this.prisma.gymSession.findFirst({
      where: { id, userId },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
  }

  async updateSession(id: string, userId: string, dto: UpdateGymSessionDto) {
    return this.prisma.gymSession.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async removeSession(id: string, userId: string) {
    return this.prisma.gymSession.deleteMany({
      where: { id, userId },
    });
  }

  // ========== EXERCISES ==========
  async addExercise(sessionId: string, userId: string, dto: CreateGymExerciseDto) {
    // Verify session belongs to user
    const session = await this.prisma.gymSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return this.prisma.gymExercise.create({
      data: {
        sessionId,
        name: dto.name,
        sets: dto.sets,
        reps: dto.reps,
        weight: dto.weight,
        restTime: dto.restTime,
        notes: dto.notes,
        order: dto.order || 0,
      },
    });
  }

  async updateExercise(exerciseId: string, dto: UpdateGymExerciseDto) {
    return this.prisma.gymExercise.update({
      where: { id: exerciseId },
      data: dto,
    });
  }

  async removeExercise(exerciseId: string) {
    return this.prisma.gymExercise.delete({
      where: { id: exerciseId },
    });
  }

  // ========== PROGRESS ==========
  async getExerciseProgress(userId: string, exerciseName: string, limit = 10) {
    const sessions = await this.prisma.gymSession.findMany({
      where: { userId },
      include: {
        exercises: {
          where: { name: exerciseName },
          orderBy: { createdAt: 'desc' },
          take: limit,
        },
      },
      orderBy: { date: 'desc' },
    });

    const exercises = sessions
      .flatMap((s) => s.exercises)
      .slice(0, limit);

    return exercises;
  }
}
