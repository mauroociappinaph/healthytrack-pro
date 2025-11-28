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
import { WalksService } from './walks.service';
import { CreateWalkDto, UpdateWalkDto } from './dto/walk.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('walks')
@UseGuards(JwtAuthGuard)
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateWalkDto) {
    return this.walksService.create(user.userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.walksService.findAll(user.userId, start, end);
  }

  @Get('stats')
  getStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.walksService.getStats(user.userId, start, end);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walksService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateWalkDto,
  ) {
    return this.walksService.update(id, user.userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walksService.remove(id, user.userId);
  }
}
