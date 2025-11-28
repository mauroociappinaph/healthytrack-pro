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
import { HomeExercisesService } from './home-exercises.service';
import { CreateHomeExerciseDto, UpdateHomeExerciseDto } from './dto/home-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('home-exercises')
@UseGuards(JwtAuthGuard)
export class HomeExercisesController {
  constructor(private readonly homeExercisesService: HomeExercisesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateHomeExerciseDto) {
    return this.homeExercisesService.create(user.userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.homeExercisesService.findAll(user.userId, start, end);
  }

  @Get('stats')
  getStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.homeExercisesService.getStats(user.userId, start, end);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.homeExercisesService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateHomeExerciseDto,
  ) {
    return this.homeExercisesService.update(id, user.userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.homeExercisesService.remove(id, user.userId);
  }
}
