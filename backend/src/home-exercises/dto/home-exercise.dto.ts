export class CreateHomeExerciseDto {
  type: string; // "cardio", "strength", "flexibility", "yoga", etc.
  duration: number; // minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  date?: Date;
  notes?: string;
}

export class UpdateHomeExerciseDto {
  type?: string;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  date?: Date;
  notes?: string;
}
