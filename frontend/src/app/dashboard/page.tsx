'use client';

import { TrendingUp, TrendingDown, Wallet, PiggyBank, LineChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolioSummary, useInvestments } from '@/hooks';
import { formatCurrency, formatPercentage, formatDate, cn } from '@/lib/utils';

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: 'positive' | 'negative' | 'neutral';
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div
            className={cn(
              'text-2xl font-bold',
              trend === 'positive' && 'text-green-600',
              trend === 'negative' && 'text-red-600'
            )}
          >
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentInvestmentsTable() {
  const { data, isLoading, error } = useInvestments({ limit: 5, sortBy: 'createdAt', order: 'desc' });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive py-4">Failed to load recent investments</p>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-8">
        <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-4">No investments yet</p>
        <Button asChild>
          <Link href="/investments">Add Your First Investment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {data.data.map((investment) => {
        const profit = investment.currentValue - investment.investedAmount;
        const isPositive = profit >= 0;

        return (
          <div
            key={investment.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{investment.investmentName}</p>
              <p className="text-sm text-muted-foreground">
                {investment.investmentType} • {formatDate(investment.purchaseDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
              <p
                className={cn(
                  'text-sm flex items-center justify-end gap-1',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatCurrency(Math.abs(profit))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your investment portfolio</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Invested"
            value={formatCurrency(summary?.totalInvested || 0)}
            icon={Wallet}
            isLoading={summaryLoading}
          />
          <StatCard
            title="Current Value"
            value={formatCurrency(summary?.currentValue || 0)}
            icon={LineChart}
            isLoading={summaryLoading}
          />
          <StatCard
            title="Total Profit/Loss"
            value={formatCurrency(summary?.profit || 0)}
            icon={summary?.profit && summary.profit >= 0 ? TrendingUp : TrendingDown}
            trend={
              summary?.profit === undefined || summary.profit === 0
                ? 'neutral'
                : summary.profit > 0
                ? 'positive'
                : 'negative'
            }
            isLoading={summaryLoading}
          />
          <StatCard
            title="Returns"
            value={formatPercentage(summary?.profitPercentage || 0)}
            icon={summary?.profitPercentage && summary.profitPercentage >= 0 ? TrendingUp : TrendingDown}
            trend={
              summary?.profitPercentage === undefined || summary.profitPercentage === 0
                ? 'neutral'
                : summary.profitPercentage > 0
                ? 'positive'
                : 'negative'
            }
            isLoading={summaryLoading}
          />
        </div>

        {/* Recent Investments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Investments</CardTitle>
              <CardDescription>Your latest investment activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/investments" className="flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentInvestmentsTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
