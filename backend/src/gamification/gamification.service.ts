import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Configuración de niveles (XP requerido para cada nivel)
const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, // Niveles 1-6
  1350, 1750, 2200, 2700, 3250, // Niveles 7-11
  3850, 4500, 5200, 6000, 7000, // Niveles 12-16
  8200, 9600, 11200, 13000, 15000, // Niveles 17-21
];

// Acciones que otorgan XP
export const XP_REWARDS = {
  WORKOUT_COMPLETED: 50,
  MEAL_LOGGED: 20,
  HEALTH_METRIC_LOGGED: 30,
  DAILY_STREAK: 10,
  WEEKLY_GOAL_COMPLETED: 100,
};

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene o crea el progreso de un usuario
   */
  async getUserProgress(userId: string) {
    let progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await this.prisma.userProgress.create({
        data: { userId },
      });
    }

    return progress;
  }

  /**
   * Añade XP a un usuario y verifica si sube de nivel
   */
  async addXP(userId: string, amount: number, reason: string) {
    const progress = await this.getUserProgress(userId);
    const newXP = progress.xp + amount;
    const newLevel = this.calculateLevel(newXP);
    const leveledUp = newLevel > progress.level;

    const updatedProgress = await this.prisma.userProgress.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
        lastActiveAt: new Date(),
      },
    });

    // Verificar badges después de añadir XP
    await this.checkAndUnlockBadges(userId);

    return {
      progress: updatedProgress,
      leveledUp,
      xpGained: amount,
      reason,
    };
  }

  /**
   * Calcula el nivel basado en el XP total
   */
  private calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Obtiene el XP necesario para el siguiente nivel
   */
  getXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    }
    return LEVEL_THRESHOLDS[currentLevel];
  }

  /**
   * Verifica y desbloquea badges para un usuario
   */
  async checkAndUnlockBadges(userId: string) {
    const unlockedBadges = [];

    // Obtener todos los badges
    const allBadges = await this.prisma.badge.findMany();

    // Obtener badges ya desbloqueados
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });
    const unlockedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    // Verificar cada badge
    for (const badge of allBadges) {
      if (unlockedBadgeIds.has(badge.id)) continue;

      const requirement = JSON.parse(badge.requirement);
      const unlocked = await this.checkBadgeRequirement(userId, requirement);

      if (unlocked) {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        unlockedBadges.push(badge);
      }
    }

    return unlockedBadges;
  }

  /**
   * Verifica si un usuario cumple con el requisito de un badge
   */
  private async checkBadgeRequirement(
    userId: string,
    requirement: any,
  ): Promise<boolean> {
    const { type, value } = requirement;

    switch (type) {
      case 'level':
        const progress = await this.getUserProgress(userId);
        return progress.level >= value;

      case 'workouts':
        const workoutCount = await this.prisma.walk.count({
          where: { userId },
        });
        return workoutCount >= value;

      case 'streak':
        const userProgress = await this.getUserProgress(userId);
        return userProgress.currentStreak >= value;

      default:
        return false;
    }
  }

  /**
   * Obtiene todos los badges desbloqueados de un usuario
   */
  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });
  }

  /**
   * Obtiene todos los badges disponibles
   */
  async getAllBadges() {
    return this.prisma.badge.findMany({
      orderBy: {
        category: 'asc',
      },
    });
  }

  /**
   * Actualiza la racha diaria del usuario
   */
  async updateDailyStreak(userId: string) {
    const progress = await this.getUserProgress(userId);
    const now = new Date();
    const lastActive = new Date(progress.lastActiveAt);
    const daysDiff = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
    );

    let newStreak = progress.currentStreak;

    if (daysDiff === 1) {
      // Día consecutivo
      newStreak += 1;
      await this.addXP(userId, XP_REWARDS.DAILY_STREAK, 'Daily streak');
    } else if (daysDiff > 1) {
      // Racha rota
      newStreak = 1;
    }

    await this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        lastActiveAt: now,
      },
    });

    return newStreak;
  }
}
