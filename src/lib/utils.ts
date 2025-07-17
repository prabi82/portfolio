export function formatCurrency(amount: number, currency: 'INR' | 'USD' = 'INR'): string {
  const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function calculateXIRR(cashflows: { amount: number; date: Date }[]): number {
  // Simple XIRR calculation (this is a simplified version)
  // In a real implementation, you'd want to use a more sophisticated algorithm
  if (cashflows.length < 2) return 0;
  
  const totalInvestment = cashflows.reduce((sum, cf) => sum + cf.amount, 0);
  const totalReturn = cashflows[cashflows.length - 1].amount;
  
  if (totalInvestment === 0) return 0;
  
  return ((totalReturn - totalInvestment) / totalInvestment) * 100;
} 