import {
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, GenerateWeeklyReportDto } from './dto/reports.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ========== DAILY SUMMARY ==========
  @Get('daily')
  getDailySummary(
    @CurrentUser() user: any,
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return this.reportsService.getDailySummary(user.userId, targetDate);
  }

  @Post('daily/generate')
  generateDailySummary(
    @CurrentUser() user: any,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.generateDailySummary(user.userId, dto.date);
  }

  // ========== MONTHLY REPORT ==========
  @Get('monthly')
  getMonthlySummaries(
    @CurrentUser() user: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const m = parseInt(month);
    const y = parseInt(year);
    return this.reportsService.getMonthlySummaries(user.userId, m, y);
  }

  // ========== WEEKLY REPORT ==========
  @Get('weekly-daily')
  getWeeklyDailySummaries(
    @CurrentUser() user: any,
    @Query('weekNumber') weekNumber?: string,
    @Query('year') year?: string,
  ) {
    const week = weekNumber ? parseInt(weekNumber) : undefined;
    const yr = year ? parseInt(year) : undefined;
    return this.reportsService.getWeeklyDailySummaries(user.userId, week, yr);
  }

  @Get('weekly')
  getWeeklyReport(
    @CurrentUser() user: any,
    @Query('weekNumber') weekNumber?: string,
    @Query('year') year?: string,
  ) {
    const week = weekNumber ? parseInt(weekNumber) : undefined;
    const yr = year ? parseInt(year) : undefined;
    return this.reportsService.getWeeklyReport(user.userId, week, yr);
  }

  @Post('weekly/generate')
  generateWeeklyReport(
    @CurrentUser() user: any,
    @Body() dto: GenerateWeeklyReportDto,
  ) {
    const now = new Date();
    const weekNumber = dto.weekNumber || this.getWeekNumber(now);
    const year = dto.year || now.getFullYear();
    return this.reportsService.generateWeeklyReport(user.userId, weekNumber, year);
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
