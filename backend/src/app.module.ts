import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WalksModule } from './walks/walks.module';
import { HomeExercisesModule } from './home-exercises/home-exercises.module';
import { GymModule } from './gym/gym.module';
import { MealsModule } from './meals/meals.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WalksModule,
    HomeExercisesModule,
    GymModule,
    MealsModule,
    HealthModule,
    ReportsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
