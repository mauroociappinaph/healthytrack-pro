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
import { GymService } from './gym.service';
import {
  CreateGymSessionDto,
  UpdateGymSessionDto,
  CreateGymExerciseDto,
  UpdateGymExerciseDto,
} from './dto/gym.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('gym')
@UseGuards(JwtAuthGuard)
export class GymController {
  constructor(private readonly gymService: GymService) {}

  // ========== SESSIONS ==========
  @Post('sessions')
  createSession(@CurrentUser() user: any, @Body() dto: CreateGymSessionDto) {
    return this.gymService.createSession(user.userId, dto);
  }

  @Get('sessions')
  findAllSessions(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gymService.findAllSessions(user.userId, start, end);
  }

  @Get('sessions/:id')
  findOneSession(@CurrentUser() user: any, @Param('id') id: string) {
    return this.gymService.findOneSession(id, user.userId);
  }

  @Patch('sessions/:id')
  updateSession(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateGymSessionDto,
  ) {
    return this.gymService.updateSession(id, user.userId, dto);
  }

  @Delete('sessions/:id')
  removeSession(@CurrentUser() user: any, @Param('id') id: string) {
    return this.gymService.removeSession(id, user.userId);
  }

  // ========== EXERCISES ==========
  @Post('sessions/:sessionId/exercises')
  addExercise(
    @CurrentUser() user: any,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateGymExerciseDto,
  ) {
    return this.gymService.addExercise(sessionId, user.userId, dto);
  }

  @Patch('exercises/:id')
  updateExercise(@Param('id') id: string, @Body() dto: UpdateGymExerciseDto) {
    return this.gymService.updateExercise(id, dto);
  }

  @Delete('exercises/:id')
  removeExercise(@Param('id') id: string) {
    return this.gymService.removeExercise(id);
  }

  // ========== PROGRESS ==========
  @Get('progress/:exerciseName')
  getExerciseProgress(
    @CurrentUser() user: any,
    @Param('exerciseName') exerciseName: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.gymService.getExerciseProgress(user.userId, exerciseName, limitNum);
  }
}
