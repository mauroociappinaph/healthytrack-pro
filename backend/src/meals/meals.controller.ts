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
import { MealsService } from './meals.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateMealDto) {
    return this.mealsService.create(user.userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.mealsService.findAll(user.userId, start, end);
  }

  @Get('stats')
  getStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.mealsService.getStats(user.userId, start, end);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.mealsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateMealDto,
  ) {
    return this.mealsService.update(id, user.userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.mealsService.remove(id, user.userId);
  }
}
