import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentQueryDto,
  InvestmentResponseDto,
  PaginatedInvestmentsResponseDto,
  INVESTMENT_TYPES,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('investments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new investment' })
  @ApiResponse({
    status: 201,
    description: 'Investment created successfully',
    type: InvestmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.create(userId, createInvestmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all investments with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'type', required: false, enum: INVESTMENT_TYPES })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['investmentName', 'investmentType', 'investedAmount', 'currentValue', 'purchaseDate', 'createdAt'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'List of investments',
    type: PaginatedInvestmentsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: InvestmentQueryDto,
  ): Promise<PaginatedInvestmentsResponseDto> {
    return this.investmentsService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single investment by ID' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Investment details',
    type: InvestmentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your investment' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.findOne(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an investment' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Investment updated successfully',
    type: InvestmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your investment' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.update(userId, id, updateInvestmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an investment' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: String })
  @ApiResponse({ status: 204, description: 'Investment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your investment' })
  @ApiResponse({ status: 404, description: 'Investment not found' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.investmentsService.remove(userId, id);
  }
}
