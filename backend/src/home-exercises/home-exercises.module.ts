import { Module } from '@nestjs/common';
import { HomeExercisesService } from './home-exercises.service';
import { HomeExercisesController } from './home-exercises.controller';

@Module({
  controllers: [HomeExercisesController],
  providers: [HomeExercisesService],
  exports: [HomeExercisesService],
})
export class HomeExercisesModule {}
