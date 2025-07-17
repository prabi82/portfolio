import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockHolding, Transaction, Goal } from '@/types';

interface PortfolioState {
  holdings: StockHolding[];
  goals: Goal[];
  addHolding: (holding: Omit<StockHolding, 'id'>) => void;
  updateHolding: (id: string, updates: Partial<StockHolding>) => void;
  deleteHolding: (id: string) => void;
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