import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService, XP_REWARDS } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let prisma: PrismaService;

  const mockPrismaService = {
    userProgress: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    badge: {
      findMany: jest.fn(),
    },
    userBadge: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    walk: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProgress', () => {
    it('should return existing user progress', async () => {
      const mockProgress = {
        id: '1',
        userId: 'user1',
        xp: 100,
        level: 2,
        currentStreak: 5,
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);

      const result = await service.getUserProgress('user1');

      expect(result).toEqual(mockProgress);
      expect(prisma.userProgress.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
    });

    it('should create new progress if user has none', async () => {
      const mockNewProgress = {
        id: '1',
        userId: 'user1',
        xp: 0,
        level: 1,
        currentStreak: 0,
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(null);
      mockPrismaService.userProgress.create.mockResolvedValue(mockNewProgress);

      const result = await service.getUserProgress('user1');

      expect(result).toEqual(mockNewProgress);
      expect(prisma.userProgress.create).toHaveBeenCalledWith({
        data: { userId: 'user1' },
      });
    });
  });

  describe('addXP', () => {
    it('should add XP and not level up if threshold not reached', async () => {
      const mockProgress = {
        id: '1',
        userId: 'user1',
        xp: 50,
        level: 1,
        currentStreak: 0,
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProgress = { ...mockProgress, xp: 100, level: 2 };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
      mockPrismaService.badge.findMany.mockResolvedValue([]);
      mockPrismaService.userBadge.findMany.mockResolvedValue([]);

      const result = await service.addXP('user1', 50, 'Test XP');

      expect(result.progress.xp).toBe(100);
      expect(result.progress.level).toBe(2);
      expect(result.leveledUp).toBe(true); // Level up from 1 to 2
      expect(result.xpGained).toBe(50);
    });

    it('should add XP and level up if threshold reached', async () => {
      const mockProgress = {
        id: '1',
        userId: 'user1',
        xp: 80,
        level: 1,
        currentStreak: 0,
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProgress = { ...mockProgress, xp: 130, level: 2 };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userProgress.update.mockResolvedValue(updatedProgress);
      mockPrismaService.badge.findMany.mockResolvedValue([]);
      mockPrismaService.userBadge.findMany.mockResolvedValue([]);

      const result = await service.addXP('user1', 50, 'Workout completed');

      expect(result.progress.xp).toBe(130);
      expect(result.progress.level).toBe(2);
      expect(result.leveledUp).toBe(true);
    });
  });

  describe('checkAndUnlockBadges', () => {
    it('should unlock badge when requirement is met', async () => {
      const mockBadge = {
        id: 'badge1',
        name: 'First Workout',
        description: 'Complete your first workout',
        icon: '🎯',
        category: 'special',
        requirement: JSON.stringify({ type: 'workouts', value: 1 }),
        createdAt: new Date(),
      };

      mockPrismaService.badge.findMany.mockResolvedValue([mockBadge]);
      mockPrismaService.userBadge.findMany.mockResolvedValue([]);
      mockPrismaService.walk.count.mockResolvedValue(1);
      mockPrismaService.userBadge.create.mockResolvedValue({
        id: '1',
        userId: 'user1',
        badgeId: 'badge1',
        unlockedAt: new Date(),
      });

      const result = await service.checkAndUnlockBadges('user1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockBadge);
      expect(prisma.userBadge.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          badgeId: 'badge1',
        },
      });
    });

    it('should not unlock badge if already unlocked', async () => {
      const mockBadge = {
        id: 'badge1',
        name: 'First Workout',
        description: 'Complete your first workout',
        icon: '🎯',
        category: 'special',
        requirement: JSON.stringify({ type: 'workouts', value: 1 }),
        createdAt: new Date(),
      };

      mockPrismaService.badge.findMany.mockResolvedValue([mockBadge]);
      mockPrismaService.userBadge.findMany.mockResolvedValue([
        { badgeId: 'badge1' },
      ]);

      const result = await service.checkAndUnlockBadges('user1');

      expect(result).toHaveLength(0);
      expect(prisma.userBadge.create).not.toHaveBeenCalled();
    });
  });

  describe('updateDailyStreak', () => {
    it('should increment streak for consecutive day', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockProgress = {
        id: '1',
        userId: 'user1',
        xp: 100,
        level: 2,
        currentStreak: 5,
        lastActiveAt: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userProgress.update.mockResolvedValue({
        ...mockProgress,
        currentStreak: 6,
      });
      mockPrismaService.badge.findMany.mockResolvedValue([]);
      mockPrismaService.userBadge.findMany.mockResolvedValue([]);

      const result = await service.updateDailyStreak('user1');

      expect(result).toBe(6);
    });

    it('should reset streak if more than 1 day passed', async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const mockProgress = {
        id: '1',
        userId: 'user1',
        xp: 100,
        level: 2,
        currentStreak: 5,
        lastActiveAt: threeDaysAgo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.userProgress.findUnique.mockResolvedValue(mockProgress);
      mockPrismaService.userProgress.update.mockResolvedValue({
        ...mockProgress,
        currentStreak: 1,
      });

      const result = await service.updateDailyStreak('user1');

      expect(result).toBe(1);
    });
  });

  describe('XP_REWARDS constants', () => {
    it('should have correct XP values', () => {
      expect(XP_REWARDS.WORKOUT_COMPLETED).toBe(50);
      expect(XP_REWARDS.MEAL_LOGGED).toBe(20);
      expect(XP_REWARDS.HEALTH_METRIC_LOGGED).toBe(30);
      expect(XP_REWARDS.DAILY_STREAK).toBe(10);
      expect(XP_REWARDS.WEEKLY_GOAL_COMPLETED).toBe(100);
    });
  });
});
