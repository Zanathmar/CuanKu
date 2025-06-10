// pages/Analytics/Index.tsx
import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../components/Sidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, 
  Target, AlertCircle, Eye, Filter, Download
} from 'lucide-react';

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
  amount: number;
  income: number;
  balance: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
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
}

const Analytics: React.FC<AnalyticsProps> = ({ expenses, incomes, stats }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeframe, setTimeframe] = useState('6M');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate monthly data for the last 12 months
  const monthlyAnalytics = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.created_at);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      const monthIncome = incomes
        .filter(income => {
          const incomeDate = new Date(income.created_at);
          return incomeDate.getMonth() === date.getMonth() && 
                 incomeDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, income) => sum + income.amount, 0);

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
  }, [expenses, incomes]);

  // Calculate category analytics
  const categoryAnalytics = useMemo(() => {
    const categoryMap = new Map();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    expenses.forEach(expense => {
      if (categoryMap.has(expense.category)) {
        const existing = categoryMap.get(expense.category);
        categoryMap.set(expense.category, {
          ...existing,
          amount: existing.amount + expense.amount,
          transactions: existing.transactions + 1
        });
      } else {
        categoryMap.set(expense.category, {
          category: expense.category,
          amount: expense.amount,
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
  }, [expenses]);

  // Calculate spending trends
  const spendingTrends = useMemo(() => {
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
  }, [monthlyAnalytics]);

  // Colors for charts
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

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

  return (
    <>
      <Head title="Analytics - CuanKu" />
      
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Deep insights into your financial patterns</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                  {timeframeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeframe(option.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        timeframe === option.value
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  spendingTrends.monthlyChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {spendingTrends.isIncreasing ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(spendingTrends.monthlyChange).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(spendingTrends.averageSpending)}
              </div>
              <div className="text-sm text-gray-500">Avg Monthly Spending</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <span className={`text-sm font-medium ${
                  spendingTrends.savingsRate > 20 ? 'text-green-600' : spendingTrends.savingsRate > 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {spendingTrends.savingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(monthlyAnalytics[monthlyAnalytics.length - 1]?.balance || 0)}
              </div>
              <div className="text-sm text-gray-500">Current Savings Rate</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-600">
                  {categoryAnalytics.length} Categories
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {categoryAnalytics[0]?.category || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Top Spending Category</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-yellow-600">
                  {spendingTrends.bestSavingsMonth.fullMonth}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {spendingTrends.bestSavingsMonth.savings.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Best Savings Month</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trend Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Expenses</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentTimeframeData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(Number(value)), '']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#incomeGradient)" />
                    <Area type="monotone" dataKey="amount" stroke="#EF4444" fill="url(#expenseGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryAnalytics}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="amount"
                      label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                    >
                      {categoryAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Category Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Category Details</h3>
              <p className="text-gray-600 mt-1">Detailed breakdown of your spending categories</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {categoryAnalytics.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{category.category}</div>
                        <div className="text-sm text-gray-500">{category.transactions} transactions</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(category.amount)}</div>
                      <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Savings Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Savings Progress</h3>
              <p className="text-gray-600 mt-1">Track your monthly savings performance</p>
            </div>
            
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentTimeframeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                    <Tooltip 
                      formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Savings Rate']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                    />
                    <Bar dataKey="savings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;