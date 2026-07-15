import { api } from '../api';
import {
  Investment,
  PaginatedResponse,
  InvestmentQueryParams,
  CreateInvestmentData,
  UpdateInvestmentData,
} from '@/types';

export const investmentsService = {
  async getAll(params?: InvestmentQueryParams): Promise<PaginatedResponse<Investment>> {
    const response = await api.get<PaginatedResponse<Investment>>('/investments', { params });
    return response.data;
  },

  async getById(id: string): Promise<Investment> {
    const response = await api.get<Investment>(`/investments/${id}`);
    return response.data;
  },

  async create(data: CreateInvestmentData): Promise<Investment> {
    const response = await api.post<Investment>('/investments', data);
    return response.data;
  },

  async update(id: string, data: UpdateInvestmentData): Promise<Investment> {
    const response = await api.put<Investment>(`/investments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/investments/${id}`);
  },
};
