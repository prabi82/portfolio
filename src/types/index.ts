export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: 'INR' | 'USD';
  quantity: number;
  averageBuyPrice: number;
  transactions: Transaction[];
  sector?: string;
  currentPrice?: number;
  marketValue?: number;
  gainLoss?: number;
  gainLossPercentage?: number;
}

export interface Transaction {
  id: string;
  holdingId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  date: Date;
  quantity: number;
  price: number;
  brokerage?: number;
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: Date;
  notes?: string;
  progress?: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  currency: 'INR' | 'USD';
}

export interface AssetAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface CurrencyAllocation {
  currency: 'INR' | 'USD';
  value: number;
  percentage: number;
} 