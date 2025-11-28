export class CreateMealDto {
  photoUrl?: string;
  description: string;
  calories?: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: Date;
}

export class UpdateMealDto {
  photoUrl?: string;
  description?: string;
  calories?: number;
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: Date;
}
