// ========== SLEEP DTOs ==========
export class CreateSleepDto {
  hours: number;
  quality: number; // 1-10
  date?: Date;
  notes?: string;
}

export class UpdateSleepDto {
  hours?: number;
  quality?: number;
  date?: Date;
  notes?: string;
}

// ========== STRESS DTOs ==========
export class CreateStressDto {
  level: number; // 1-10
  date?: Date;
  notes?: string;
}

export class UpdateStressDto {
  level?: number;
  date?: Date;
  notes?: string;
}

// ========== HEART METRICS DTOs ==========
export class CreateHeartMetricDto {
  rhr?: number; // Resting Heart Rate (bpm)
  hrv?: number; // Heart Rate Variability (ms)
  date?: Date;
  notes?: string;
}

export class UpdateHeartMetricDto {
  rhr?: number;
  hrv?: number;
  date?: Date;
  notes?: string;
}

// ========== ENERGY DTOs ==========
export class CreateEnergyDto {
  level: number; // 1-10
  date?: Date;
  notes?: string;
}

export class UpdateEnergyDto {
  level?: number;
  date?: Date;
  notes?: string;
}
