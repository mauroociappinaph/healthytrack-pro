import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsIn(['achievement', 'reminder', 'goal', 'alert'])
  type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
