import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PortfolioSummaryDto } from './dto/portfolio-summary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('portfolio')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get portfolio summary with aggregated statistics' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio summary',
    type: PortfolioSummaryDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSummary(@CurrentUser('id') userId: string): Promise<PortfolioSummaryDto> {
    return this.portfolioService.getSummary(userId);
  }
}
