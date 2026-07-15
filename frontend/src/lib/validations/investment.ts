import { z } from 'zod';
import { INVESTMENT_TYPES } from '@/types';

export const investmentSchema = z.object({
  investmentName: z
    .string()
    .min(1, 'Investment name is required')
    .max(200, 'Investment name is too long'),
  investmentType: z.enum(INVESTMENT_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select an investment type' }),
  }),
  investedAmount: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Invested amount must be greater than 0'),
  currentValue: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .min(0, 'Current value cannot be negative'),
  purchaseDate: z.string().refine(
    (date) => {
      const purchaseDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return purchaseDate <= today;
    },
    { message: 'Purchase date cannot be in the future' }
  ),
});

export type InvestmentFormData = z.infer<typeof investmentSchema>;
