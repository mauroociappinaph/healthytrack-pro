import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@test.com', password: 'password', name: 'Test' };
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        ...dto,
        password: hashedPassword,
      });

      const result = await service.register(dto);

      expect(result).toHaveProperty('access_token', 'test-token');
      expect(result.user).toHaveProperty('email', dto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {
      const dto = { email: 'test@test.com', password: 'password', name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.register(dto)).rejects.toThrow();
    });
  });
});
