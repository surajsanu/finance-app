import { api } from '../api';
import { PortfolioSummary } from '@/types';

export const portfolioService = {
  async getSummary(): Promise<PortfolioSummary> {
    const response = await api.get<PortfolioSummary>('/portfolio/summary');
    return response.data;
  },
};
