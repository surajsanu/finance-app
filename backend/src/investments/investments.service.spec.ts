import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('InvestmentsService', () => {
  let service: InvestmentsService;
  let prisma: jest.Mocked<PrismaService>;

  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const otherUserId = '987fcdeb-51a2-3def-4567-890123456789';
  const investmentId = 'abc12345-6789-0def-ghij-klmnopqrstuv';

  const mockInvestment = {
    id: investmentId,
    userId: userId,
    investmentName: 'Test Fund',
    investmentType: 'Mutual Fund',
    investedAmount: new Prisma.Decimal(10000),
    currentValue: new Prisma.Decimal(12000),
    purchaseDate: new Date('2024-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      investment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InvestmentsService>(InvestmentsService);
    prisma = module.get(PrismaService);
  });

  describe('findOne - ownership protection', () => {
    it('should return investment if user owns it', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);

      const result = await service.findOne(userId, investmentId);

      expect(result.id).toBe(investmentId);
      expect(result.investmentName).toBe('Test Fund');
    });

    it('should throw NotFoundException if investment does not exist', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId, 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own investment', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);

      await expect(service.findOne(otherUserId, investmentId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update - ownership protection', () => {
    it('should update investment if user owns it', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);
      (prisma.investment.update as jest.Mock).mockResolvedValue({
        ...mockInvestment,
        investmentName: 'Updated Fund',
      });

      const result = await service.update(userId, investmentId, {
        investmentName: 'Updated Fund',
      });

      expect(result.investmentName).toBe('Updated Fund');
    });

    it('should throw NotFoundException if investment does not exist', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update(userId, 'non-existent-id', { investmentName: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own investment', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);

      await expect(
        service.update(otherUserId, investmentId, { investmentName: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove - ownership protection', () => {
    it('should delete investment if user owns it', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);
      (prisma.investment.delete as jest.Mock).mockResolvedValue(mockInvestment);

      await expect(service.remove(userId, investmentId)).resolves.not.toThrow();
      expect(prisma.investment.delete).toHaveBeenCalledWith({
        where: { id: investmentId },
      });
    });

    it('should throw NotFoundException if investment does not exist', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId, 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own investment', async () => {
      (prisma.investment.findUnique as jest.Mock).mockResolvedValue(mockInvestment);

      await expect(service.remove(otherUserId, investmentId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll - user isolation', () => {
    it('should only return investments belonging to the user', async () => {
      (prisma.investment.findMany as jest.Mock).mockResolvedValue([mockInvestment]);
      (prisma.investment.count as jest.Mock).mockResolvedValue(1);

      await service.findAll(userId, {});

      expect(prisma.investment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId }),
        }),
      );
    });
  });
});
