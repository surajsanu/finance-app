import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { INVESTMENT_TYPES } from './create-investment.dto';

export class InvestmentQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Mutual Fund',
    description: 'Filter by investment type',
    enum: INVESTMENT_TYPES,
  })
  @IsOptional()
  @IsString()
  @IsIn([...INVESTMENT_TYPES], {
    message: `Type must be one of: ${INVESTMENT_TYPES.join(', ')}`,
  })
  type?: string;

  @ApiPropertyOptional({
    example: 'HDFC',
    description: 'Search by investment name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'purchaseDate',
    description: 'Field to sort by',
    enum: ['investmentName', 'investmentType', 'investedAmount', 'currentValue', 'purchaseDate', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['investmentName', 'investmentType', 'investedAmount', 'currentValue', 'purchaseDate', 'createdAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
