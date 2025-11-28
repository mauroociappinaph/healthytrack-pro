export class CreateWalkDto {
  duration: number; // minutes
  distance?: number; // kilometers (optional)
  intensity: 'low' | 'medium' | 'high';
  date?: Date;
  notes?: string;
}

export class UpdateWalkDto {
  duration?: number;
  distance?: number;
  intensity?: 'low' | 'medium' | 'high';
  date?: Date;
  notes?: string;
}
