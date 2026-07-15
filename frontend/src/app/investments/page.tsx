'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PiggyBank,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvestmentForm } from '@/components/investments/investment-form';
import { DeleteInvestmentDialog } from '@/components/investments/delete-investment-dialog';
import {
  useInvestments,
  useCreateInvestment,
  useUpdateInvestment,
  useDeleteInvestment,
} from '@/hooks';
import { useToast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Investment, INVESTMENT_TYPES, InvestmentQueryParams } from '@/types';
import { InvestmentFormData } from '@/lib/validations/investment';

export default function InvestmentsPage() {
  const { toast } = useToast();

  const [queryParams, setQueryParams] = useState<InvestmentQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [searchValue, setSearchValue] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();
  const [deletingInvestment, setDeletingInvestment] = useState<Investment | null>(null);

  const { data, isLoading, error } = useInvestments(queryParams);
  const createMutation = useCreateInvestment();
  const updateMutation = useUpdateInvestment();
  const deleteMutation = useDeleteInvestment();

  const handleSearch = useCallback(() => {
    setQueryParams((prev) => ({ ...prev, search: searchValue || undefined, page: 1 }));
  }, [searchValue]);

  const handleTypeFilter = (type: string) => {
    setQueryParams((prev) => ({
      ...prev,
      type: type === 'all' ? undefined : type,
      page: 1,
    }));
  };

  const handleSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleCreateSubmit = async (formData: InvestmentFormData) => {
    try {
      await createMutation.mutateAsync({
        investmentName: formData.investmentName,
        investmentType: formData.investmentType as Investment['investmentType'],
        investedAmount: formData.investedAmount,
        currentValue: formData.currentValue,
        purchaseDate: formData.purchaseDate,
      });
      toast({
        title: 'Investment added',
        description: 'Your investment has been added successfully.',
        variant: 'success',
      });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to add investment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleEditSubmit = async (formData: InvestmentFormData) => {
    if (!editingInvestment) return;

    try {
      await updateMutation.mutateAsync({
        id: editingInvestment.id,
        data: {
          investmentName: formData.investmentName,
          investmentType: formData.investmentType as Investment['investmentType'],
          investedAmount: formData.investedAmount,
          currentValue: formData.currentValue,
          purchaseDate: formData.purchaseDate,
        },
      });
      toast({
        title: 'Investment updated',
        description: 'Your investment has been updated successfully.',
        variant: 'success',
      });
      setEditingInvestment(undefined);
    } catch (error) {
      toast({
        title: 'Failed to update investment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingInvestment) return;

    try {
      await deleteMutation.mutateAsync(deletingInvestment.id);
      toast({
        title: 'Investment deleted',
        description: 'Your investment has been deleted successfully.',
        variant: 'success',
      });
      setDeletingInvestment(null);
    } catch (error) {
      toast({
        title: 'Failed to delete investment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return [...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ));
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-destructive">
            Failed to load investments. Please try again.
          </TableCell>
        </TableRow>
      );
    }

    if (!data?.data.length) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-12">
            <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No investments found</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Investment
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    return data.data.map((investment) => {
      const profit = investment.currentValue - investment.investedAmount;
      const isPositive = profit >= 0;

      return (
        <TableRow key={investment.id}>
          <TableCell className="font-medium">{investment.investmentName}</TableCell>
          <TableCell>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {investment.investmentType}
            </span>
          </TableCell>
          <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
          <TableCell>{formatCurrency(investment.currentValue)}</TableCell>
          <TableCell>
            <span
              className={cn(
                'flex items-center gap-1 text-sm',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {formatCurrency(Math.abs(profit))}
            </span>
          </TableCell>
          <TableCell>{formatDate(investment.purchaseDate)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingInvestment(investment)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeletingInvestment(investment)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Investments</h1>
            <p className="text-muted-foreground">Manage your investment portfolio</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by name..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={queryParams.type || 'all'}
                onValueChange={handleTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {INVESTMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => handleSort('investmentName')}
                      >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => handleSort('investedAmount')}
                      >
                        Invested
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => handleSort('currentValue')}
                      >
                        Current Value
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => handleSort('purchaseDate')}
                      >
                        Purchase Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : data?.data.length ? (
                data.data.map((investment) => {
                  const profit = investment.currentValue - investment.investedAmount;
                  const isPositive = profit >= 0;

                  return (
                    <Card key={investment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{investment.investmentName}</h3>
                            <span className="text-xs text-muted-foreground">
                              {investment.investmentType}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingInvestment(investment)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingInvestment(investment)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Invested:</span>
                            <p className="font-medium">{formatCurrency(investment.investedAmount)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>
                            <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Profit/Loss:</span>
                            <p
                              className={cn(
                                'font-medium flex items-center gap-1',
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
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{formatDate(investment.purchaseDate)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No investments found</p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Investment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(data.meta.page - 1) * data.meta.limit + 1} to{' '}
              {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total}{' '}
              investments
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(data.meta.page - 1)}
                disabled={!data.meta.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(data.meta.page + 1)}
                disabled={!data.meta.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <InvestmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <InvestmentForm
        open={!!editingInvestment}
        onOpenChange={(open) => !open && setEditingInvestment(undefined)}
        onSubmit={handleEditSubmit}
        investment={editingInvestment}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteInvestmentDialog
        open={!!deletingInvestment}
        onOpenChange={(open) => !open && setDeletingInvestment(null)}
        investment={deletingInvestment}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
