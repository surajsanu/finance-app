export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Investment {
  id: string;
  investmentName: string;
  investmentType: InvestmentType;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export type InvestmentType =
  | 'Mutual Fund'
  | 'Stocks'
  | 'Fixed Deposit'
  | 'Bonds'
  | 'Gold'
  | 'Cryptocurrency'
  | 'Other';

export const INVESTMENT_TYPES: InvestmentType[] = [
  'Mutual Fund',
  'Stocks',
  'Fixed Deposit',
  'Bonds',
  'Gold',
  'Cryptocurrency',
  'Other',
];

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

export interface InvestmentQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateInvestmentData {
  investmentName: string;
  investmentType: InvestmentType;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
}

export interface UpdateInvestmentData extends Partial<CreateInvestmentData> {}
