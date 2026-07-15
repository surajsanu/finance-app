'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { investmentSchema, InvestmentFormData } from '@/lib/validations/investment';
import { Investment, INVESTMENT_TYPES } from '@/types';

interface InvestmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InvestmentFormData) => Promise<void>;
  investment?: Investment;
  isSubmitting?: boolean;
}

export function InvestmentForm({
  open,
  onOpenChange,
  onSubmit,
  investment,
  isSubmitting,
}: InvestmentFormProps) {
  const isEditing = !!investment;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: investment
      ? {
          investmentName: investment.investmentName,
          investmentType: investment.investmentType,
          investedAmount: investment.investedAmount,
          currentValue: investment.currentValue,
          purchaseDate: investment.purchaseDate,
        }
      : {
          investmentName: '',
          investmentType: undefined,
          investedAmount: undefined,
          currentValue: undefined,
          purchaseDate: new Date().toISOString().split('T')[0],
        },
  });

  const handleFormSubmit = async (data: InvestmentFormData) => {
    await onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Investment' : 'Add Investment'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the details of your investment.'
                : 'Add a new investment to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="investmentName">Investment Name</Label>
              <Input
                id="investmentName"
                placeholder="e.g., HDFC Flexi Cap Fund"
                {...register('investmentName')}
              />
              {errors.investmentName && (
                <p className="text-sm text-destructive">{errors.investmentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentType">Investment Type</Label>
              <Controller
                name="investmentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.investmentType && (
                <p className="text-sm text-destructive">{errors.investmentType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investedAmount">Invested Amount</Label>
                <Input
                  id="investedAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10000"
                  {...register('investedAmount', { valueAsNumber: true })}
                />
                {errors.investedAmount && (
                  <p className="text-sm text-destructive">{errors.investedAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12500"
                  {...register('currentValue', { valueAsNumber: true })}
                />
                {errors.currentValue && (
                  <p className="text-sm text-destructive">{errors.currentValue.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('purchaseDate')}
              />
              {errors.purchaseDate && (
                <p className="text-sm text-destructive">{errors.purchaseDate.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Investment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
