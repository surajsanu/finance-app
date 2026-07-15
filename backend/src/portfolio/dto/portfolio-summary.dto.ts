import { ApiProperty } from '@nestjs/swagger';

export class PortfolioSummaryDto {
  @ApiProperty({
    example: 50000,
    description: 'Total amount invested across all investments',
  })
  totalInvested: number;

  @ApiProperty({
    example: 62000,
    description: 'Total current value of all investments',
  })
  currentValue: number;

  @ApiProperty({
    example: 12000,
    description: 'Total profit or loss (currentValue - totalInvested)',
  })
  profit: number;

  @ApiProperty({
    example: 24,
    description: 'Profit/loss percentage ((profit / totalInvested) * 100)',
  })
  profitPercentage: number;
}
