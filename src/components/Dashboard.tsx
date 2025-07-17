'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const { 
    holdings, 
    calculatePortfolioValue, 
    calculateTotalInvested, 
    calculateTotalGainLoss,
    refreshPrices
  } = usePortfolioStore();
  
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    try {
      await refreshPrices();
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const portfolioValue = calculatePortfolioValue();
  const totalInvested = calculateTotalInvested();
  const totalGainLoss = calculateTotalGainLoss();
  const gainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your investments and financial goals</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(portfolioValue)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalInvested)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Gain/Loss</h3>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalGainLoss)} ({gainLossPercentage.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Holdings</h2>
            {holdings.length > 0 && (
              <button
                onClick={handleRefreshPrices}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
              >
                <span>{isRefreshing ? '🔄' : '💰'}</span>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Prices'}</span>
              </button>
            )}
          </div>
          
          {holdings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No holdings yet. Add your first investment to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchases
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {holdings.map((holding) => {
                    const marketValue = (holding.currentPrice || holding.averageBuyPrice) * holding.quantity;
                    const gainLoss = marketValue - (holding.averageBuyPrice * holding.quantity);
                    const gainLossPercentage = (gainLoss / (holding.averageBuyPrice * holding.quantity)) * 100;
                    const isExpanded = expandedRow === holding.id;
                    const buyTransactions = holding.transactions.filter(t => t.type === 'BUY');

                    return (
                      <>
                        <tr key={holding.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {holding.symbol}
                              </div>
                              <div className="text-sm text-gray-500">
                                {holding.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {holding.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(holding.averageBuyPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(holding.currentPrice || holding.averageBuyPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(marketValue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(gainLoss)} ({gainLossPercentage.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : holding.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              {buyTransactions.length} purchase{buyTransactions.length !== 1 ? 's' : ''}
                              <span className="ml-1">
                                {isExpanded ? '↑' : '↓'}
                              </span>
                            </button>
                          </td>
                        </tr>
                        
                        {isExpanded && buyTransactions.length > 0 && (
                          <tr key={`${holding.id}-expanded`}>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Purchase History</h4>
                                <div className="grid grid-cols-5 gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider border-b pb-2">
                                  <div>Date</div>
                                  <div>Quantity</div>
                                  <div>Price</div>
                                  <div>Brokerage</div>
                                  <div>Notes</div>
                                </div>
                                {buyTransactions
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map((transaction) => (
                                    <div key={transaction.id} className="grid grid-cols-5 gap-4 text-sm text-gray-900 py-2 border-b border-gray-200">
                                      <div>{new Date(transaction.date).toLocaleDateString()}</div>
                                      <div>{transaction.quantity}</div>
                                      <div>{formatCurrency(transaction.price)}</div>
                                      <div>{formatCurrency(transaction.brokerage || 0)}</div>
                                      <div className="text-gray-600">{transaction.notes || '-'}</div>
                                    </div>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 