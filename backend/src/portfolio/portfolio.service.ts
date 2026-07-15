import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortfolioSummaryDto } from './dto/portfolio-summary.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string): Promise<PortfolioSummaryDto> {
    const result = await this.prisma.investment.aggregate({
      where: { userId },
      _sum: {
        investedAmount: true,
        currentValue: true,
      },
    });

    const totalInvested = Number(result._sum.investedAmount) || 0;
    const currentValue = Number(result._sum.currentValue) || 0;
    const profit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested * 100) / 100,
      currentValue: Math.round(currentValue * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      profitPercentage: Math.round(profitPercentage * 100) / 100,
    };
  }
}
