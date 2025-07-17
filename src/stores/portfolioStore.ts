import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockHolding, Transaction, Goal } from '@/types';
import { searchStock } from '@/lib/stockApi';

interface PurchaseData {
  symbol: string;
  name: string;
  exchange: string;
  currency: 'INR' | 'USD';
  quantity: number;
  buyPrice: number;
  purchaseDate: string;
  currentPrice?: number;
  sector?: string;
  brokerage?: number;
  notes?: string;
}

interface PortfolioState {
  holdings: StockHolding[];
  goals: Goal[];
  addHolding: (holding: Omit<StockHolding, 'id'>) => void;
  addPurchase: (purchase: PurchaseData) => void;
  updateHolding: (id: string, updates: Partial<StockHolding>) => void;
  deleteHolding: (id: string) => void;
  refreshPrices: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  calculatePortfolioValue: () => number;
  calculateTotalInvested: () => number;
  calculateTotalGainLoss: () => number;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      holdings: [],
      goals: [],

      addHolding: (holding) => {
        const newHolding: StockHolding = {
          ...holding,
          id: crypto.randomUUID(),
          transactions: [],
        };
        set((state) => ({
          holdings: [...state.holdings, newHolding],
        }));
      },

      addPurchase: (purchase) => {
        set((state) => {
          // Check if stock already exists
          const existingHoldingIndex = state.holdings.findIndex(
            holding => holding.symbol === purchase.symbol
          );

          const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            holdingId: '', // Will be set below
            type: 'BUY',
            date: new Date(purchase.purchaseDate),
            quantity: purchase.quantity,
            price: purchase.buyPrice,
            brokerage: purchase.brokerage || 0,
            notes: purchase.notes || '',
          };

          if (existingHoldingIndex >= 0) {
            // Stock exists - add transaction and recalculate average
            const existingHolding = state.holdings[existingHoldingIndex];
            newTransaction.holdingId = existingHolding.id;
            
            const updatedTransactions = [...existingHolding.transactions, newTransaction];
            const totalQuantity = updatedTransactions
              .filter(t => t.type === 'BUY')
              .reduce((sum, t) => sum + t.quantity, 0);
            const totalInvestment = updatedTransactions
              .filter(t => t.type === 'BUY')
              .reduce((sum, t) => sum + (t.quantity * t.price) + (t.brokerage || 0), 0);
            
            const updatedHolding: StockHolding = {
              ...existingHolding,
              quantity: totalQuantity,
              averageBuyPrice: totalInvestment / totalQuantity,
              transactions: updatedTransactions,
              currentPrice: purchase.currentPrice || existingHolding.currentPrice,
            };

            const newHoldings = [...state.holdings];
            newHoldings[existingHoldingIndex] = updatedHolding;

            return { holdings: newHoldings };
          } else {
            // New stock - create new holding
            const newHoldingId = crypto.randomUUID();
            newTransaction.holdingId = newHoldingId;

            const newHolding: StockHolding = {
              id: newHoldingId,
              symbol: purchase.symbol,
              name: purchase.name,
              exchange: purchase.exchange,
              currency: purchase.currency,
              quantity: purchase.quantity,
              averageBuyPrice: purchase.buyPrice + (purchase.brokerage || 0) / purchase.quantity,
              transactions: [newTransaction],
              sector: purchase.sector,
              currentPrice: purchase.currentPrice,
            };

            return { holdings: [...state.holdings, newHolding] };
          }
        });
      },

      updateHolding: (id, updates) => {
        set((state) => ({
          holdings: state.holdings.map((holding) =>
            holding.id === id ? { ...holding, ...updates } : holding
          ),
        }));
      },

      deleteHolding: (id) => {
        set((state) => ({
          holdings: state.holdings.filter((holding) => holding.id !== id),
        }));
      },

      refreshPrices: async () => {
        const { holdings } = get();
        
        // Update prices for all holdings
        const updatedHoldings = await Promise.all(
          holdings.map(async (holding) => {
            try {
              const result = await searchStock(holding.symbol);
              if (result.success && result.data && result.data.price > 0) {
                return { ...holding, currentPrice: result.data.price };
              }
            } catch (error) {
              console.error(`Failed to update price for ${holding.symbol}:`, error);
            }
            return holding; // Return unchanged if price update failed
          })
        );

        set({ holdings: updatedHoldings });
      },

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          holdings: state.holdings.map((holding) =>
            holding.id === transaction.holdingId
              ? {
                  ...holding,
                  transactions: [...holding.transactions, newTransaction],
                }
              : holding
          ),
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          holdings: state.holdings.map((holding) => ({
            ...holding,
            transactions: holding.transactions.map((transaction) =>
              transaction.id === id ? { ...transaction, ...updates } : transaction
            ),
          })),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          holdings: state.holdings.map((holding) => ({
            ...holding,
            transactions: holding.transactions.filter(
              (transaction) => transaction.id !== id
            ),
          })),
        }));
      },

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      calculatePortfolioValue: () => {
        const { holdings } = get();
        return holdings.reduce((total, holding) => {
          const marketValue = (holding.currentPrice || holding.averageBuyPrice) * holding.quantity;
          return total + marketValue;
        }, 0);
      },

      calculateTotalInvested: () => {
        const { holdings } = get();
        return holdings.reduce((total, holding) => {
          return total + (holding.averageBuyPrice * holding.quantity);
        }, 0);
      },

      calculateTotalGainLoss: () => {
        const { holdings } = get();
        return holdings.reduce((total, holding) => {
          const currentValue = (holding.currentPrice || holding.averageBuyPrice) * holding.quantity;
          const investedValue = holding.averageBuyPrice * holding.quantity;
          return total + (currentValue - investedValue);
        }, 0);
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
); 