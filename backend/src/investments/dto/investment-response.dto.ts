import { ApiProperty } from '@nestjs/swagger';

export class InvestmentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'HDFC Flexi Cap Fund' })
  investmentName: string;

  @ApiProperty({ example: 'Mutual Fund' })
  investmentType: string;

  @ApiProperty({ example: 10000 })
  investedAmount: number;

  @ApiProperty({ example: 12500 })
  currentValue: number;

  @ApiProperty({ example: '2024-01-15' })
  purchaseDate: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPrevPage: boolean;
}

export class PaginatedInvestmentsResponseDto {
  @ApiProperty({ type: [InvestmentResponseDto] })
  data: InvestmentResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
