import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSleepDto,
  UpdateSleepDto,
  CreateStressDto,
  UpdateStressDto,
  CreateHeartMetricDto,
  UpdateHeartMetricDto,
  CreateEnergyDto,
  UpdateEnergyDto,
} from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  // ========== SLEEP ==========
  async createSleep(userId: string, dto: CreateSleepDto) {
    return this.prisma.sleep.create({
      data: {
        userId,
        hours: dto.hours,
        quality: dto.quality,
        date: dto.date || new Date(),
        notes: dto.notes,
      },
    });
  }

  async findAllSleep(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    return this.prisma.sleep.findMany({ where, orderBy: { date: 'desc' } });
  }

  async getSleepStats(userId: string, startDate?: Date, endDate?: Date) {
    const records = await this.findAllSleep(userId, startDate, endDate);
    const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
    const totalQuality = records.reduce((sum, r) => sum + r.quality, 0);

    return {
      total: records.length,
      avgHours: records.length > 0 ? totalHours / records.length : 0,
      avgQuality: records.length > 0 ? totalQuality / records.length : 0,
    };
  }

  async updateSleep(id: string, userId: string, dto: UpdateSleepDto) {
    return this.prisma.sleep.updateMany({ where: { id, userId }, data: dto });
  }

  async deleteSleep(id: string, userId: string) {
    return this.prisma.sleep.deleteMany({ where: { id, userId } });
  }

  // ========== STRESS ==========
  async createStress(userId: string, dto: CreateStressDto) {
    return this.prisma.stress.create({
      data: {
        userId,
        level: dto.level,
        date: dto.date || new Date(),
        notes: dto.notes,
      },
    });
  }

  async findAllStress(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    return this.prisma.stress.findMany({ where, orderBy: { date: 'desc' } });
  }

  async getStressStats(userId: string, startDate?: Date, endDate?: Date) {
    const records = await this.findAllStress(userId, startDate, endDate);
    const totalLevel = records.reduce((sum, r) => sum + r.level, 0);

    return {
      total: records.length,
      avgLevel: records.length > 0 ? totalLevel / records.length : 0,
      maxLevel: records.length > 0 ? Math.max(...records.map(r => r.level)) : 0,
    };
  }

  async updateStress(id: string, userId: string, dto: UpdateStressDto) {
    return this.prisma.stress.updateMany({ where: { id, userId }, data: dto });
  }

  async deleteStress(id: string, userId: string) {
    return this.prisma.stress.deleteMany({ where: { id, userId } });
  }

  // ========== HEART METRICS ==========
  async createHeartMetric(userId: string, dto: CreateHeartMetricDto) {
    return this.prisma.heartMetric.create({
      data: {
        userId,
        rhr: dto.rhr,
        hrv: dto.hrv,
        date: dto.date || new Date(),
        notes: dto.notes,
      },
    });
  }

  async findAllHeartMetrics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    return this.prisma.heartMetric.findMany({ where, orderBy: { date: 'desc' } });
  }

  async analyzeHeartMetrics(userId: string) {
    const metrics = await this.findAllHeartMetrics(userId);

    if (metrics.length < 2) return null;

    // Get last 7 days for comparison
    const last7Days = metrics.slice(0, 7);
    const avgRhr = last7Days
      .filter(m => m.rhr)
      .reduce((sum, m) => sum + m.rhr!, 0) / last7Days.filter(m => m.rhr).length;

    const avgHrv = last7Days
      .filter(m => m.hrv)
      .reduce((sum, m) => sum + m.hrv!, 0) / last7Days.filter(m => m.hrv).length;

    // Check last measurement
    const latest = metrics[0];
    const warnings: string[] = [];

    if (latest.rhr && avgRhr) {
      const rhrIncrease = latest.rhr - avgRhr;
      if (rhrIncrease > 8) {
        warnings.push('RHR increased by more than 8 bpm - possible fatigue');
      }
    }

    if (latest.hrv && avgHrv) {
      const hrvDecrease = ((avgHrv - latest.hrv) / avgHrv) * 100;
      if (hrvDecrease > 15) {
        warnings.push('HRV decreased by more than 15% - elevated stress detected');
      }
    }

    return {
      avgRhr,
      avgHrv,
      latest,
      warnings,
    };
  }

  async updateHeartMetric(id: string, userId: string, dto: UpdateHeartMetricDto) {
    return this.prisma.heartMetric.updateMany({ where: { id, userId }, data: dto });
  }

  async deleteHeartMetric(id: string, userId: string) {
    return this.prisma.heartMetric.deleteMany({ where: { id, userId } });
  }

  // ========== ENERGY ==========
  async createEnergy(userId: string, dto: CreateEnergyDto) {
    return this.prisma.energy.create({
      data: {
        userId,
        level: dto.level,
        date: dto.date || new Date(),
        notes: dto.notes,
      },
    });
  }

  async findAllEnergy(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    return this.prisma.energy.findMany({ where, orderBy: { date: 'desc' } });
  }

  async getEnergyStats(userId: string, startDate?: Date, endDate?: Date) {
    const records = await this.findAllEnergy(userId, startDate, endDate);
    const totalLevel = records.reduce((sum, r) => sum + r.level, 0);

    return {
      total: records.length,
      avgLevel: records.length > 0 ? totalLevel / records.length : 0,
    };
  }

  async updateEnergy(id: string, userId: string, dto: UpdateEnergyDto) {
    return this.prisma.energy.updateMany({ where: { id, userId }, data: dto });
  }

  async deleteEnergy(id: string, userId: string) {
    return this.prisma.energy.deleteMany({ where: { id, userId } });
  }
}
