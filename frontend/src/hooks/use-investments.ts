'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentsService } from '@/lib/services/investments';
import { InvestmentQueryParams, CreateInvestmentData, UpdateInvestmentData } from '@/types';

export const investmentKeys = {
  all: ['investments'] as const,
  lists: () => [...investmentKeys.all, 'list'] as const,
  list: (params: InvestmentQueryParams) => [...investmentKeys.lists(), params] as const,
  details: () => [...investmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentKeys.details(), id] as const,
};

export function useInvestments(params?: InvestmentQueryParams) {
  return useQuery({
    queryKey: investmentKeys.list(params || {}),
    queryFn: () => investmentsService.getAll(params),
  });
}

export function useInvestment(id: string) {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: () => investmentsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvestmentData) => investmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvestmentData }) =>
      investmentsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => investmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}
