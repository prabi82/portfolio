'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePortfolioStore } from '@/stores/portfolioStore';

const holdingSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Company name is required'),
  exchange: z.string().min(1, 'Exchange is required'),
  currency: z.enum(['INR', 'USD']),
  quantity: z.number().positive('Quantity must be positive'),
  averageBuyPrice: z.number().positive('Average buy price must be positive'),
  currentPrice: z.number().positive('Current price must be positive').optional(),
  sector: z.string().optional(),
});

type HoldingFormData = z.infer<typeof holdingSchema>;

export default function AddHoldingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { addHolding } = usePortfolioStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HoldingFormData>({
    resolver: zodResolver(holdingSchema),
  });

  const onSubmit = (data: HoldingFormData) => {
    addHolding({
      ...data,
      currentPrice: data.currentPrice || data.averageBuyPrice,
      transactions: [],
    });
    reset();
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add New Holding
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Holding</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symbol *
                </label>
                <input
                  type="text"
                  {...register('symbol')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., AAPL"
                />
                {errors.symbol && (
                  <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>
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
                  Average Buy Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('averageBuyPrice', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 150.00"
                />
                {errors.averageBuyPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.averageBuyPrice.message}</p>
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
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  reset();
                }}
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