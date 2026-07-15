import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let prisma: jest.Mocked<PrismaService>;

  const userId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const mockPrismaService = {
      investment: {
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    prisma = module.get(PrismaService);
  });

  describe('getSummary', () => {
    it('should calculate portfolio summary correctly with investments', async () => {
      (prisma.investment.aggregate as jest.Mock).mockResolvedValue({
        _sum: {
          investedAmount: { valueOf: () => 50000 },
          currentValue: { valueOf: () => 62000 },
        },
      });

      const result = await service.getSummary(userId);

      expect(result.totalInvested).toBe(50000);
      expect(result.currentValue).toBe(62000);
      expect(result.profit).toBe(12000);
      expect(result.profitPercentage).toBe(24);
    });

    it('should handle empty portfolio correctly', async () => {
      (prisma.investment.aggregate as jest.Mock).mockResolvedValue({
        _sum: {
          investedAmount: null,
          currentValue: null,
        },
      });

      const result = await service.getSummary(userId);

      expect(result.totalInvested).toBe(0);
      expect(result.currentValue).toBe(0);
      expect(result.profit).toBe(0);
      expect(result.profitPercentage).toBe(0);
    });

    it('should calculate negative profit correctly', async () => {
      (prisma.investment.aggregate as jest.Mock).mockResolvedValue({
        _sum: {
          investedAmount: { valueOf: () => 100000 },
          currentValue: { valueOf: () => 80000 },
        },
      });

      const result = await service.getSummary(userId);

      expect(result.totalInvested).toBe(100000);
      expect(result.currentValue).toBe(80000);
      expect(result.profit).toBe(-20000);
      expect(result.profitPercentage).toBe(-20);
    });

    it('should round values to 2 decimal places', async () => {
      (prisma.investment.aggregate as jest.Mock).mockResolvedValue({
        _sum: {
          investedAmount: { valueOf: () => 33333.333 },
          currentValue: { valueOf: () => 44444.444 },
        },
      });

      const result = await service.getSummary(userId);

      expect(result.totalInvested).toBe(33333.33);
      expect(result.currentValue).toBe(44444.44);
    });

    it('should only aggregate investments for the specified user', async () => {
      (prisma.investment.aggregate as jest.Mock).mockResolvedValue({ _sum: {} });
      await service.getSummary(userId);

      expect(prisma.investment.aggregate).toHaveBeenCalledWith({
        where: { userId },
        _sum: {
          investedAmount: true,
          currentValue: true,
        },
      });
    });
  });
});
