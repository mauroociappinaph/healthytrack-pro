import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HealthService } from './health.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // ========== SLEEP ==========
  @Post('sleep')
  createSleep(@CurrentUser() user: any, @Body() dto: CreateSleepDto) {
    return this.healthService.createSleep(user.userId, dto);
  }

  @Get('sleep')
  findAllSleep(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.findAllSleep(user.userId, start, end);
  }

  @Get('sleep/stats')
  getSleepStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.getSleepStats(user.userId, start, end);
  }

  @Patch('sleep/:id')
  updateSleep(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateSleepDto,
  ) {
    return this.healthService.updateSleep(id, user.userId, dto);
  }

  @Delete('sleep/:id')
  deleteSleep(@CurrentUser() user: any, @Param('id') id: string) {
    return this.healthService.deleteSleep(id, user.userId);
  }

  // ========== STRESS ==========
  @Post('stress')
  createStress(@CurrentUser() user: any, @Body() dto: CreateStressDto) {
    return this.healthService.createStress(user.userId, dto);
  }

  @Get('stress')
  findAllStress(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.findAllStress(user.userId, start, end);
  }

  @Get('stress/stats')
  getStressStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.getStressStats(user.userId, start, end);
  }

  @Patch('stress/:id')
  updateStress(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateStressDto,
  ) {
    return this.healthService.updateStress(id, user.userId, dto);
  }

  @Delete('stress/:id')
  deleteStress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.healthService.deleteStress(id, user.userId);
  }

  // ========== HEART METRICS ==========
  @Post('heart-metrics')
  createHeartMetric(@CurrentUser() user: any, @Body() dto: CreateHeartMetricDto) {
    return this.healthService.createHeartMetric(user.userId, dto);
  }

  @Get('heart-metrics')
  findAllHeartMetrics(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.findAllHeartMetrics(user.userId, start, end);
  }

  @Get('heart-metrics/analysis')
  analyzeHeartMetrics(@CurrentUser() user: any) {
    return this.healthService.analyzeHeartMetrics(user.userId);
  }

  @Patch('heart-metrics/:id')
  updateHeartMetric(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateHeartMetricDto,
  ) {
    return this.healthService.updateHeartMetric(id, user.userId, dto);
  }

  @Delete('heart-metrics/:id')
  deleteHeartMetric(@CurrentUser() user: any, @Param('id') id: string) {
    return this.healthService.deleteHeartMetric(id, user.userId);
  }

  // ========== ENERGY ==========
  @Post('energy')
  createEnergy(@CurrentUser() user: any, @Body() dto: CreateEnergyDto) {
    return this.healthService.createEnergy(user.userId, dto);
  }

  @Get('energy')
  findAllEnergy(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.findAllEnergy(user.userId, start, end);
  }

  @Get('energy/stats')
  getEnergyStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthService.getEnergyStats(user.userId, start, end);
  }

  @Patch('energy/:id')
  updateEnergy(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateEnergyDto,
  ) {
    return this.healthService.updateEnergy(id, user.userId, dto);
  }

  @Delete('energy/:id')
  deleteEnergy(@CurrentUser() user: any, @Param('id') id: string) {
    return this.healthService.deleteEnergy(id, user.userId);
  }
}
