'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { searchStock } from '@/lib/stockApi';

// Debounce utility function
function debounce(func: (symbol: string) => Promise<void>, wait: number) {
  let timeout: NodeJS.Timeout;
  return (symbol: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(symbol), wait);
  };
}

const purchaseSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Company name is required'),
  exchange: z.string().min(1, 'Exchange is required'),
  currency: z.enum(['INR', 'USD']),
  quantity: z.number().positive('Quantity must be positive'),
  buyPrice: z.number().positive('Buy price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  currentPrice: z.number().positive('Current price must be positive').optional(),
  sector: z.string().optional(),
  brokerage: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function AddHoldingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [stockSearchError, setStockSearchError] = useState<string | null>(null);
  const { addPurchase } = usePortfolioStore();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0], // Today's date
    },
  });

  const watchedSymbol = watch('symbol');

  // Debounced stock search
  const searchStockData = async (symbol: string) => {
    if (!symbol || symbol.length < 2) return;
    
    setIsLoadingStock(true);
    setStockSearchError(null);
    
    try {
      const result = await searchStock(symbol);
      
      if (result.success && result.data) {
        const stock = result.data;
        setValue('name', stock.name);
        setValue('exchange', stock.exchange);
        setValue('currency', stock.currency as 'INR' | 'USD');
        setValue('currentPrice', stock.price);
        setValue('sector', stock.sector || '');
      } else {
        setStockSearchError(result.error || 'Stock not found');
      }
    } catch {
      setStockSearchError('Failed to fetch stock data');
    } finally {
      setIsLoadingStock(false);
    }
  };

  const debouncedSearchStock = useCallback(
    debounce(searchStockData, 800),
    [setValue]
  );

  // Watch symbol changes and trigger search
  useEffect(() => {
    if (watchedSymbol) {
      debouncedSearchStock(watchedSymbol);
    }
  }, [watchedSymbol, debouncedSearchStock]);

  const onSubmit = (data: PurchaseFormData) => {
    addPurchase({
      ...data,
      currentPrice: data.currentPrice || data.buyPrice,
    });
    reset();
    setIsLoadingStock(false);
    setStockSearchError(null);
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsLoadingStock(false);
    setStockSearchError(null);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add Stock Purchase
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Stock Purchase</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you already own this stock, this purchase will be consolidated with your existing holding.
              </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symbol *
                  {isLoadingStock && (
                    <span className="ml-2 text-blue-500 text-xs">🔍 Searching...</span>
                  )}
                </label>
                                  <input
                  type="text"
                  {...register('symbol')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., AAPL, NVDA, RELIANCE, TCS, BHARTIARTL, ICICIBANK"
                />
                {errors.symbol && (
                  <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>
                )}
                {stockSearchError && (
                  <p className="mt-1 text-sm text-yellow-600">⚠️ {stockSearchError}</p>
                )}
                {watchedSymbol && !isLoadingStock && !stockSearchError && !errors.symbol && (
                  <p className="mt-1 text-sm text-green-600">✅ Stock details auto-filled</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Apple Inc."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exchange *
                </label>
                <input
                  type="text"
                  {...register('exchange')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., NASDAQ, NSE"
                />
                {errors.exchange && (
                  <p className="mt-1 text-sm text-red-600">{errors.exchange.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency *
                </label>
                <select
                  {...register('currency')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 100"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Buy Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('buyPrice', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 150.00"
                />
                {errors.buyPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  {...register('purchaseDate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brokerage (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('brokerage', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 15.00"
                />
                {errors.brokerage && (
                  <p className="mt-1 text-sm text-red-600">{errors.brokerage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('currentPrice', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 160.00"
                />
                {errors.currentPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sector
                </label>
                <input
                  type="text"
                  {...register('sector')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Technology"
                />
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Long-term investment, SIP purchase, etc."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Holding
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 