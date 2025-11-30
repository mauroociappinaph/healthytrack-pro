// Gamification Types
export interface UserProgress {
  id: string;
  userId: string;
  xp: number;
  level: number;
  currentStreak: number;
  lastActiveAt: string;
  xpForNextLevel?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'consistency' | 'activity' | 'health' | 'special';
  requirement: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  unlockedAt: string;
}

export interface XPGainResult {
  progress: UserProgress;
  leveledUp: boolean;
  xpGained: number;
  reason: string;
}
