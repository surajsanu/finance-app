import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export const INVESTMENT_TYPES = [
  'Mutual Fund',
  'Stocks',
  'Fixed Deposit',
  'Bonds',
  'Gold',
  'Cryptocurrency',
  'Other',
] as const;

export type InvestmentType = (typeof INVESTMENT_TYPES)[number];

export class CreateInvestmentDto {
  @ApiProperty({
    example: 'HDFC Flexi Cap Fund',
    description: 'Name of the investment',
  })
  @IsString()
  @IsNotEmpty({ message: 'Investment name is required' })
  @Transform(({ value }) => value?.trim())
  investmentName: string;

  @ApiProperty({
    example: 'Mutual Fund',
    description: 'Type of investment',
    enum: INVESTMENT_TYPES,
  })
  @IsString()
  @IsNotEmpty({ message: 'Investment type is required' })
  @IsIn(INVESTMENT_TYPES, {
    message: `Investment type must be one of: ${INVESTMENT_TYPES.join(', ')}`,
  })
  investmentType: InvestmentType;

  @ApiProperty({
    example: 10000,
    description: 'Amount invested (must be greater than 0)',
  })
  @IsNumber({}, { message: 'Invested amount must be a number' })
  @IsPositive({ message: 'Invested amount must be greater than 0' })
  investedAmount: number;

  @ApiProperty({
    example: 12500,
    description: 'Current value of the investment (cannot be negative)',
  })
  @IsNumber({}, { message: 'Current value must be a number' })
  @Min(0, { message: 'Current value cannot be negative' })
  currentValue: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date of purchase (cannot be in the future)',
  })
  @IsDateString({}, { message: 'Purchase date must be a valid date' })
  purchaseDate: string;
}
