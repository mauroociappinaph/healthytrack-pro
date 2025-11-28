export class CreateGymSessionDto {
  name: string;
  date?: Date;
  duration?: number;
  notes?: string;
}

export class UpdateGymSessionDto {
  name?: string;
  date?: Date;
  duration?: number;
  notes?: string;
}

export class CreateGymExerciseDto {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
  order?: number;
}

export class UpdateGymExerciseDto {
  name?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  restTime?: number;
  notes?: string;
  order?: number;
}
