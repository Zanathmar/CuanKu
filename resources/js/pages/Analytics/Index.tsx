// resources/js/Pages/Analytics/Index.tsx
import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../components/Sidebar';
import {
  AnalyticsHeader,
  KeyMetrics,
  IncomeVsExpensesChart,
  CategoryBreakdownChart,
  CategoryDetails,
  SavingsProgress
} from '../components/Analytics';

// Types
interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at: string;
}

interface Income {
  id: number;
  title: string;
  amount: number;
  created_at: string;
}

interface MonthlyData {
  month: string;
  fullMonth: string;
  amount: number;
  income: number;
  balance: number;
  savings: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface SpendingTrends {
  monthlyChange: number;
  averageSpending: number;
  savingsRate: number;
  isIncreasing: boolean;
  bestSavingsMonth: MonthlyData;
}

interface AnalyticsProps {
  expenses: Expense[];
  incomes: Income[];
  stats: {
    totalExpenses: number;
    totalIncome: number;
    currentBalance: number;
    transactionCount: number;
  };
  monthlyAnalytics?: MonthlyData[];
  categoryAnalytics?: CategoryData[];
  spendingTrends?: SpendingTrends;
}

const Analytics: React.FC<AnalyticsProps> = ({ 
  expenses = [], 
  incomes = [], 
  stats,
  monthlyAnalytics: backendMonthlyAnalytics,
  categoryAnalytics: backendCategoryAnalytics,
  spendingTrends: backendSpendingTrends
}) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeframe, setTimeframe] = useState('6M');

  // Debug logging
  console.log('Analytics Props:', {
    expenses: expenses?.length || 0,
    incomes: incomes?.length || 0,
    stats,
    monthlyAnalytics: backendMonthlyAnalytics?.length || 0,
    categoryAnalytics: backendCategoryAnalytics?.length || 0,
    spendingTrends: backendSpendingTrends
  });

  const formatCurrency = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      amount = 0;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Use backend data if available, otherwise calculate client-side
  const monthlyAnalytics = useMemo(() => {
    // If backend provides data, use it
    if (backendMonthlyAnalytics && backendMonthlyAnalytics.length > 0) {
      return backendMonthlyAnalytics;
    }

    // Fallback: calculate client-side
    const months: MonthlyData[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.created_at);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

      const monthIncome = incomes
        .filter(income => {
          const incomeDate = new Date(income.created_at);
          return incomeDate.getMonth() === date.getMonth() && 
                 incomeDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, income) => sum + (income.amount || 0), 0);

      months.push({
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        fullMonth: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        amount: monthExpenses,
        income: monthIncome,
        balance: monthIncome - monthExpenses,
        savings: monthIncome > 0 ? ((monthIncome - monthExpenses) / monthIncome) * 100 : 0
      });
    }
    return months;
  }, [expenses, incomes, backendMonthlyAnalytics]);

  // Use backend data if available, otherwise calculate client-side
  const categoryAnalytics = useMemo(() => {
    // If backend provides data, use it
    if (backendCategoryAnalytics && backendCategoryAnalytics.length > 0) {
      return backendCategoryAnalytics;
    }

    // Fallback: calculate client-side
    const categoryMap = new Map<string, { category: string; amount: number; transactions: number }>();
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      const amount = expense.amount || 0;
      
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        categoryMap.set(category, {
          ...existing,
          amount: existing.amount + amount,
          transactions: existing.transactions + 1
        });
      } else {
        categoryMap.set(category, {
          category,
          amount,
          transactions: 1
        });
      }
    });

    return Array.from(categoryMap.values())
      .map(cat => ({
        ...cat,
        percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, backendCategoryAnalytics]);

  // Calculate spending trends
  const spendingTrends = useMemo(() => {
    // If backend provides data, use it
    if (backendSpendingTrends) {
      return backendSpendingTrends;
    }

    // Fallback: calculate client-side
    if (monthlyAnalytics.length < 2) {
      return {
        monthlyChange: 0,
        averageSpending: 0,
        savingsRate: 0,
        isIncreasing: false,
        bestSavingsMonth: monthlyAnalytics[0] || {
          month: '',
          fullMonth: '',
          amount: 0,
          income: 0,
          balance: 0,
          savings: 0
        }
      };
    }

    const currentMonth = monthlyAnalytics[monthlyAnalytics.length - 1];
    const previousMonth = monthlyAnalytics[monthlyAnalytics.length - 2];
    const lastThreeMonths = monthlyAnalytics.slice(-3);
    
    const monthlyChange = previousMonth?.amount > 0 
      ? ((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100 
      : 0;

    const averageSpending = lastThreeMonths.reduce((sum, month) => sum + month.amount, 0) / 3;
    const savingsRate = currentMonth.income > 0 
      ? ((currentMonth.income - currentMonth.amount) / currentMonth.income) * 100 
      : 0;

    return {
      monthlyChange,
      averageSpending,
      savingsRate,
      isIncreasing: monthlyChange > 0,
      bestSavingsMonth: monthlyAnalytics.reduce((best, current) => 
        current.savings > best.savings ? current : best
      )
    };
  }, [monthlyAnalytics, backendSpendingTrends]);

  const timeframeOptions = [
    { label: '3M', value: '3M', months: 3 },
    { label: '6M', value: '6M', months: 6 },
    { label: '12M', value: '12M', months: 12 },
  ];

  const getFilteredData = (months: number) => {
    return monthlyAnalytics.slice(-months);
  };

  const currentTimeframeData = getFilteredData(
    timeframeOptions.find(opt => opt.value === timeframe)?.months || 6
  );

  const handleExport = () => {
    // Export functionality can be implemented here
    console.log('Export analytics data');
  };

  // Show loading or no data state
  if (!expenses && !incomes) {
    return (
      <>
        <Head title="Analytics - CuanKu" />
        <div className="min-h-screen bg-gray-50">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="lg:ml-64 p-6 lg:p-8">
            <div className="text-center py-12">
              <div className="text-gray-500">Loading analytics data...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show no data message if arrays are empty
  if (expenses.length === 0 && incomes.length === 0) {
    return (
      <>
        <Head title="Analytics - CuanKu" />
        <div className="min-h-screen bg-gray-50">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="lg:ml-64 p-6 lg:p-8">
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No transaction data available</div>
              <div className="text-gray-400 text-sm mt-2">
                Add some expenses or income to see analytics
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Analytics - CuanKu" />
      
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="lg:ml-64 p-6 lg:p-8">
          <AnalyticsHeader
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExport={handleExport}
          />

          <KeyMetrics
            spendingTrends={spendingTrends}
            categoryAnalytics={categoryAnalytics}
            formatCurrency={formatCurrency}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <IncomeVsExpensesChart
              data={currentTimeframeData}
              formatCurrency={formatCurrency}
            />
            
            <CategoryBreakdownChart
              data={categoryAnalytics}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <CategoryDetails
                data={categoryAnalytics}
                formatCurrency={formatCurrency}
              />
            </div>
            
            <div>
              <SavingsProgress
                data={currentTimeframeData}
              />
            </div>
          </div>

          {/* Additional Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{expense.title}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <span className="text-red-600 font-medium">
                      -{formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent expenses</p>
                )}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Comparison
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900">This Month</span>
                  <span className="font-medium text-slate-950">
                    {formatCurrency(monthlyAnalytics[monthlyAnalytics.length - 1]?.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900">Last Month</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(monthlyAnalytics[monthlyAnalytics.length - 2]?.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Change</span>
                  <span className={`font-medium ${spendingTrends.isIncreasing ? 'text-red-600' : 'text-green-600'}`}>
                    {spendingTrends.isIncreasing ? '+' : ''}
                    {spendingTrends.monthlyChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Goals Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Financial Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats?.totalIncome || 0)}
                </div>
                <div className="text-sm text-gray-500">Total Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats?.totalExpenses || 0)}
                </div>
                <div className="text-sm text-gray-500">Total Expenses</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${(stats?.currentBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats?.currentBalance || 0)}
                </div>
                <div className="text-sm text-gray-500">Net Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.transactionCount || 0}
                </div>
                <div className="text-sm text-gray-500">Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;