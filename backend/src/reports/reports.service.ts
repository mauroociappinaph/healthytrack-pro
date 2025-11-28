import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ========== DAILY SUMMARY ==========
  async getDailySummary(userId: string, date: Date = new Date()) {
    // Always generate/update summary to ensure latest data
    return this.generateDailySummary(userId, date);
  }

  async generateDailySummary(userId: string, date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all activities for the day
    const [walks, homeExercises, gymSessions, meals, sleep, stress, heartMetric, energy] = await Promise.all([
      this.prisma.walk.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.homeExercise.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.gymSession.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.meal.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.sleep.findFirst({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.stress.findFirst({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.heartMetric.findFirst({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      this.prisma.energy.findFirst({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
    ]);

    // Calculate metrics
    const walkMinutes = walks.reduce((sum, w) => sum + w.duration, 0);
    const exerciseMinutes = homeExercises.reduce((sum, e) => sum + e.duration, 0);
    const totalActiveMinutes = walkMinutes + exerciseMinutes;
    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

    // Check for achievements
    if (totalActiveMinutes >= 60) {
      // Check if we already sent a notification for this today to avoid spam
      // For simplicity, we'll just check if there's an achievement notification created today
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          userId,
          type: 'achievement',
          title: '¡Meta diaria alcanzada!',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      if (!existingNotification) {
        await this.notificationsService.createAchievementNotification(
          userId,
          '¡Meta diaria alcanzada!',
          `Has completado ${totalActiveMinutes} minutos de actividad hoy. ¡Sigue así!`,
        );
      }
    }

    // Create or update daily summary
    return this.prisma.dailySummary.upsert({
      where: {
        date: startOfDay,
      },
      update: {
        walkMinutes,
        exerciseMinutes,
        gymSessions: gymSessions.length,
        totalCalories: totalCalories > 0 ? totalCalories : null,
        sleepHours: sleep?.hours,
        sleepQuality: sleep?.quality,
        stressLevel: stress?.level,
        energyLevel: energy?.level,
        rhr: heartMetric?.rhr,
        hrv: heartMetric?.hrv,
      },
      create: {
        userId,
        date: startOfDay,
        walkMinutes,
        exerciseMinutes,
        gymSessions: gymSessions.length,
        totalCalories: totalCalories > 0 ? totalCalories : null,
        sleepHours: sleep?.hours,
        sleepQuality: sleep?.quality,
        stressLevel: stress?.level,
        energyLevel: energy?.level,
        rhr: heartMetric?.rhr,
        hrv: heartMetric?.hrv,
      },
    });
  }

  // ========== WEEKLY DAILY SUMMARIES ==========
  async getWeeklyDailySummaries(userId: string, weekNumber?: number, year?: number) {
    const now = new Date();
    const targetWeek = weekNumber || this.getWeekNumber(now);
    const targetYear = year || now.getFullYear();
    const { startDate, endDate } = this.getWeekDates(targetWeek, targetYear);

    return this.prisma.dailySummary.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  // ========== MONTHLY REPORT ==========
  async getMonthlySummaries(userId: string, month: number, year: number) {
    // month is 0-indexed (0 = January) or 1-indexed? Let's assume 1-indexed from frontend
    // Adjust to 0-indexed for Date constructor
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    endDate.setHours(23, 59, 59, 999);

    return this.prisma.dailySummary.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  // ========== WEEKLY REPORT ==========
  // ========== WEEKLY REPORT ==========
  async getWeeklyReport(userId: string, weekNumber?: number, year?: number) {
    const now = new Date();
    const currentWeek = this.getWeekNumber(now);
    const currentYear = now.getFullYear();

    const targetWeek = weekNumber || currentWeek;
    const targetYear = year || currentYear;

    // If requesting current week, always generate fresh report to include latest activities
    if (targetWeek === currentWeek && targetYear === currentYear) {
      return this.generateWeeklyReport(userId, targetWeek, targetYear);
    }

    let report = await this.prisma.weeklyReport.findFirst({
      where: {
        userId,
        weekNumber: targetWeek,
        year: targetYear,
      },
    });

    if (!report) {
      report = await this.generateWeeklyReport(userId, targetWeek, targetYear);
    }

    return report;
  }

  async generateWeeklyReport(userId: string, weekNumber: number, year: number) {
    const { startDate, endDate } = this.getWeekDates(weekNumber, year);

    // Fetch all data for the week
    const [walks, homeExercises, gymSessions, meals, sleep, stress, heartMetrics, energy] = await Promise.all([
      this.prisma.walk.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.homeExercise.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.gymSession.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
        include: { exercises: true },
      }),
      this.prisma.meal.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.sleep.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.stress.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.heartMetric.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.energy.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
    ]);

    // Calculate aggregated metrics
    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const totalActiveMinutes =
      walks.reduce((sum, w) => sum + w.duration, 0) +
      homeExercises.reduce((sum, e) => sum + e.duration, 0);

    const avgSleepHours = sleep.length > 0 ? sleep.reduce((sum, s) => sum + s.hours, 0) / sleep.length : null;
    const avgSleepQuality = sleep.length > 0 ? sleep.reduce((sum, s) => sum + s.quality, 0) / sleep.length : null;
    const avgStress = stress.length > 0 ? stress.reduce((sum, s) => sum + s.level, 0) / stress.length : null;
    const avgEnergy = energy.length > 0 ? energy.reduce((sum, e) => sum + e.level, 0) / energy.length : null;

    const avgRhr =
      heartMetrics.filter((h) => h.rhr).length > 0
        ? heartMetrics.filter((h) => h.rhr).reduce((sum, h) => sum + h.rhr!, 0) /
          heartMetrics.filter((h) => h.rhr).length
        : null;

    const avgHrv =
      heartMetrics.filter((h) => h.hrv).length > 0
        ? heartMetrics.filter((h) => h.hrv).reduce((sum, h) => sum + h.hrv!, 0) /
          heartMetrics.filter((h) => h.hrv).length
        : null;

    // Analyze gym progress
    const gymProgress = this.analyzeGymProgress(gymSessions);

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      energy,
      stress,
      heartMetrics,
      avgRhr,
      avgHrv,
      gymSessions,
      sleep,
    });

    // Detect flags
    const fatigueDetected = heartMetrics.some((h, i) => {
      if (i === 0 || !h.rhr) return false;
      const prev = heartMetrics[i - 1];
      return prev.rhr && h.rhr - prev.rhr > 8;
    });

    const stressDetected = heartMetrics.some((h, i) => {
      if (i === 0 || !h.hrv) return false;
      const prev = heartMetrics[i - 1];
      return prev.hrv && ((prev.hrv - h.hrv) / prev.hrv) * 100 > 15;
    });

    const lowEnergyDetected = energy.some((e, i) => {
      if (i === 0) return false;
      const prev = energy[i - 1];
      return e.level <= 4 && prev.level <= 4;
    });

    const noProgressDetected = gymSessions.length > 0 && gymProgress.noProgress;

    // Create report
    return this.prisma.weeklyReport.upsert({
      where: {
        userId_weekNumber_year: {
          userId,
          weekNumber,
          year,
        },
      },
      update: {
        totalCalories: totalCalories > 0 ? totalCalories : null,
        totalActiveMinutes,
        avgSleepHours,
        avgSleepQuality,
        avgStress,
        avgEnergy,
        avgRhr,
        avgHrv,
        totalGymSessions: gymSessions.length,
        gymProgress: JSON.stringify(gymProgress.details),
        recommendations: JSON.stringify(recommendations),
        fatigueDetected,
        stressDetected,
        lowEnergyDetected,
        noProgressDetected,
      },
      create: {
        userId,
        weekNumber,
        year,
        startDate,
        endDate,
        totalCalories: totalCalories > 0 ? totalCalories : null,
        totalActiveMinutes,
        avgSleepHours,
        avgSleepQuality,
        avgStress,
        avgEnergy,
        avgRhr,
        avgHrv,
        totalGymSessions: gymSessions.length,
        gymProgress: JSON.stringify(gymProgress.details),
        recommendations: JSON.stringify(recommendations),
        fatigueDetected,
        stressDetected,
        lowEnergyDetected,
        noProgressDetected,
      },
    });
  }

  // ========== HELPER METHODS ==========
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private getWeekDates(weekNumber: number, year: number): { startDate: Date; endDate: Date } {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dow = simple.getDay();
    const startDate = simple;
    if (dow <= 4) startDate.setDate(simple.getDate() - simple.getDay() + 1);
    else startDate.setDate(simple.getDate() + 8 - simple.getDay());

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  private analyzeGymProgress(sessions: any[]): { noProgress: boolean; details: any } {
    if (sessions.length === 0) return { noProgress: true, details: {} };

    const exerciseMap = new Map<string, any[]>();

    sessions.forEach((session) => {
      session.exercises.forEach((ex: any) => {
        if (!exerciseMap.has(ex.name)) {
          exerciseMap.set(ex.name, []);
        }
        exerciseMap.get(ex.name)!.push({
          date: session.date,
          weight: ex.weight,
          reps: ex.reps,
        });
      });
    });

    const details: any = {};
    let hasProgress = false;

    exerciseMap.forEach((records, exerciseName) => {
      if (records.length > 1) {
        const sorted = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        if (last.weight > first.weight || last.reps > first.reps) {
          hasProgress = true;
        }

        details[exerciseName] = {
          sessions: sorted.length,
          initialWeight: first.weight,
          currentWeight: last.weight,
          progress: last.weight && first.weight ? last.weight - first.weight : 0,
        };
      }
    });

    return { noProgress: !hasProgress, details };
  }

  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    // Low energy check
    const lowEnergyDays = data.energy.filter((e: any) => e.level <= 4).length;
    if (lowEnergyDays >= 2) {
      recommendations.push('Consider taking more rest days - low energy detected for 2+ days');
    }

    // High stress check
    if (data.avgStress && data.avgStress > 7) {
      recommendations.push('Stress levels are high - consider stress management techniques');
    }

    // RHR/HRV warnings
    if (data.heartMetrics.length > 1) {
      const latest = data.heartMetrics[0];
      if (latest.rhr && data.avgRhr && latest.rhr - data.avgRhr > 8) {
        recommendations.push('Elevated RHR detected - possible fatigue, consider reducing workout intensity');
      }
      if (latest.hrv && data.avgHrv && ((data.avgHrv - latest.hrv) / data.avgHrv) * 100 > 15) {
        recommendations.push('HRV significantly decreased - high stress, prioritize recovery');
      }
    }

    // Sleep quality
    if (data.sleep.length > 0) {
      const avgQuality = data.sleep.reduce((sum: number, s: any) => sum + s.quality, 0) / data.sleep.length;
      if (avgQuality < 5) {
        recommendations.push('Sleep quality is low - focus on sleep hygiene and recovery');
      }
    }

    // Gym progress
    if (data.gymSessions.length >= 3) {
      recommendations.push('Great consistency with gym sessions! Keep up the good work');
    } else if (data.gymSessions.length === 0) {
      recommendations.push('No gym sessions this week - consider adding strength training');
    }

    if (recommendations.length === 0) {
      recommendations.push('All metrics look good! Maintain your current routine');
    }

    return recommendations;
  }
}
