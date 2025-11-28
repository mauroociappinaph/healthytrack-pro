import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMealDto) {
    return this.prisma.meal.create({
      data: {
        userId,
        photoUrl: dto.photoUrl,
        description: dto.description,
        calories: dto.calories,
        type: dto.type,
        date: dto.date || new Date(),
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

    return this.prisma.meal.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.meal.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateMealDto) {
    return this.prisma.meal.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.meal.deleteMany({
      where: { id, userId },
    });
  }

  async getStats(userId: string, startDate?: Date, endDate?: Date) {
    const meals = await this.findAll(userId, startDate, endDate);
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    return {
      total: meals.length,
      totalCalories,
      avgCalories: meals.length > 0 ? totalCalories / meals.length : 0,
      byType: meals.reduce((acc, meal) => {
        acc[meal.type] = (acc[meal.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
