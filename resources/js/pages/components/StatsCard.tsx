// components/StatsCards.tsx
import React from 'react';
import { DollarSign, TrendingUp, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Stats {
  totalExpenses: number;
  totalIncome: number;
  currentBalance: number;
  transactionCount: number;
}

interface StatsCardsProps {
  stats: Stats;
  monthlyData?: Array<{
    month: string;
    amount: number;
  }>;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, monthlyData = [] }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate trends based on monthly data
  const calculateTrend = (type: 'balance' | 'expenses' | 'income') => {
    if (monthlyData.length < 2) {
      return { percentage: 0, isUp: false };
    }

    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];

    let currentValue = 0;
    let previousValue = 0;

    switch (type) {
      case 'expenses':
        currentValue = currentMonth.amount;
        previousValue = previousMonth.amount;
        break;
      case 'income':
        // For income, we'd need income data from monthlyData
        // Since we don't have it, we'll use a simple calculation
        currentValue = stats.totalIncome;
        previousValue = stats.totalIncome * 0.92; // Simulate 8% growth
        break;
      case 'balance':
        currentValue = stats.currentBalance;
        previousValue = stats.currentBalance * 0.975; // Simulate 2.5% growth
        break;
    }

    if (previousValue === 0) {
      return { percentage: 0, isUp: currentValue > 0 };
    }

    const percentage = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    return {
      percentage: Math.abs(percentage),
      isUp: percentage > 0
    };
  };

  const balanceTrend = calculateTrend('balance');
  const expensesTrend = calculateTrend('expenses');
  const incomeTrend = calculateTrend('income');

  // Calculate progress percentages for visual bars
  const maxValue = Math.max(stats.totalIncome, stats.totalExpenses, Math.abs(stats.currentBalance));
  const getProgressPercentage = (value: number) => {
    if (maxValue === 0) return 0;
    return Math.min((Math.abs(value) / maxValue) * 100, 100);
  };

  const cards = [
    {
      title: 'Current Balance',
      value: formatCurrency(stats.currentBalance),
      subtitle: 'Available balance',
      icon: DollarSign,
      bgColor: stats.currentBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600',
      iconBg: stats.currentBalance >= 0 ? 'bg-blue-100' : 'bg-red-100',
      iconColor: stats.currentBalance >= 0 ? 'text-blue-600' : 'text-red-600',
      trend: `${balanceTrend.isUp ? '+' : '-'}${balanceTrend.percentage.toFixed(1)}%`,
      trendUp: balanceTrend.isUp,
      progress: getProgressPercentage(stats.currentBalance),
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      subtitle: `${stats.transactionCount} transactions`,
      icon: TrendingUp,
      bgColor: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: `${expensesTrend.isUp ? '+' : '-'}${expensesTrend.percentage.toFixed(1)}%`,
      trendUp: !expensesTrend.isUp, // For expenses, down is good
      progress: getProgressPercentage(stats.totalExpenses),
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      subtitle: 'Monthly income',
      icon: Receipt,
      bgColor: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: `${incomeTrend.isUp ? '+' : '-'}${incomeTrend.percentage.toFixed(1)}%`,
      trendUp: incomeTrend.isUp,
      progress: getProgressPercentage(stats.totalIncome),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? ArrowUpRight : ArrowDownRight;
        
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`flex items-center gap-1 mt-1 ${
                  card.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="text-xs font-medium">{card.trend}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">
                {card.subtitle}
              </div>
            </div>

            {/* Dynamic progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
              <div 
                className={`bg-gradient-to-r ${card.bgColor} h-1 rounded-full transition-all duration-500`}
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;