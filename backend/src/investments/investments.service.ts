import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentQueryDto,
  InvestmentResponseDto,
  PaginatedInvestmentsResponseDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInvestmentDto): Promise<InvestmentResponseDto> {
    this.validatePurchaseDate(dto.purchaseDate);

    const investment = await this.prisma.investment.create({
      data: {
        userId,
        investmentName: dto.investmentName,
        investmentType: dto.investmentType,
        investedAmount: new Prisma.Decimal(dto.investedAmount),
        currentValue: new Prisma.Decimal(dto.currentValue),
        purchaseDate: new Date(dto.purchaseDate),
      },
    });

    return this.formatInvestment(investment);
  }

  async findAll(userId: string, query: InvestmentQueryDto): Promise<PaginatedInvestmentsResponseDto> {
    const { page = 1, limit = 10, type, search, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InvestmentWhereInput = {
      userId,
      ...(type && { investmentType: type }),
      ...(search && {
        investmentName: {
          contains: search,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
    };

    const orderBy: Prisma.InvestmentOrderByWithRelationInput = {
      [sortBy]: order,
    };

    const [investments, total] = await Promise.all([
      this.prisma.investment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.investment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: investments.map((inv) => this.formatInvestment(inv)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<InvestmentResponseDto> {
    const investment = await this.prisma.investment.findUnique({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.userId !== userId) {
      throw new ForbiddenException('You do not have access to this investment');
    }

    return this.formatInvestment(investment);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    const existing = await this.prisma.investment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Investment not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not have access to this investment');
    }

    if (dto.purchaseDate) {
      this.validatePurchaseDate(dto.purchaseDate);
    }

    const updateData: Prisma.InvestmentUpdateInput = {};

    if (dto.investmentName !== undefined) {
      updateData.investmentName = dto.investmentName;
    }
    if (dto.investmentType !== undefined) {
      updateData.investmentType = dto.investmentType;
    }
    if (dto.investedAmount !== undefined) {
      updateData.investedAmount = new Prisma.Decimal(dto.investedAmount);
    }
    if (dto.currentValue !== undefined) {
      updateData.currentValue = new Prisma.Decimal(dto.currentValue);
    }
    if (dto.purchaseDate !== undefined) {
      updateData.purchaseDate = new Date(dto.purchaseDate);
    }

    const investment = await this.prisma.investment.update({
      where: { id },
      data: updateData,
    });

    return this.formatInvestment(investment);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.investment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Investment not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not have access to this investment');
    }

    await this.prisma.investment.delete({
      where: { id },
    });
  }

  private validatePurchaseDate(dateString: string): void {
    const purchaseDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (purchaseDate > today) {
      throw new BadRequestException('Purchase date cannot be in the future');
    }
  }

  private formatInvestment(investment: {
    id: string;
    investmentName: string;
    investmentType: string;
    investedAmount: Prisma.Decimal;
    currentValue: Prisma.Decimal;
    purchaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }): InvestmentResponseDto {
    return {
      id: investment.id,
      investmentName: investment.investmentName,
      investmentType: investment.investmentType,
      investedAmount: Number(investment.investedAmount),
      currentValue: Number(investment.currentValue),
      purchaseDate: investment.purchaseDate.toISOString().split('T')[0],
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    };
  }
}
