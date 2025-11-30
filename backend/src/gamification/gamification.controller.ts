import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  /**
   * GET /gamification/progress
   * Obtiene el progreso del usuario autenticado
   */
  @Get('progress')
  async getProgress(@Request() req) {
    const userId = req.user.userId;
    const progress = await this.gamificationService.getUserProgress(userId);
    const xpForNextLevel = this.gamificationService.getXPForNextLevel(
      progress.level,
    );

    return {
      ...progress,
      xpForNextLevel,
    };
  }

  /**
   * GET /gamification/badges
   * Obtiene todos los badges disponibles
   */
  @Get('badges')
  async getAllBadges() {
    return this.gamificationService.getAllBadges();
  }

  /**
   * GET /gamification/badges/unlocked
   * Obtiene los badges desbloqueados del usuario
   */
  @Get('badges/unlocked')
  async getUnlockedBadges(@Request() req) {
    const userId = req.user.userId;
    return this.gamificationService.getUserBadges(userId);
  }

  /**
   * POST /gamification/xp
   * Añade XP al usuario (uso interno o para testing)
   */
  @Post('xp')
  async addXP(
    @Request() req,
    @Body() body: { amount: number; reason: string },
  ) {
    const userId = req.user.userId;
    return this.gamificationService.addXP(userId, body.amount, body.reason);
  }

  /**
   * POST /gamification/streak
   * Actualiza la racha diaria del usuario
   */
  @Post('streak')
  async updateStreak(@Request() req) {
    const userId = req.user.userId;
    const newStreak = await this.gamificationService.updateDailyStreak(userId);
    return { currentStreak: newStreak };
  }
}
