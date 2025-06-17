// resources/js/Components/Analytics/KeyMetrics.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, Calendar } from 'lucide-react';

interface SpendingTrends {
  monthlyChange: number;
  averageSpending: number;
  savingsRate: number;
  isIncreasing: boolean;
  bestSavingsMonth: {
    fullMonth: string;
    savings: number;
    balance: number;
  };
}

interface CategoryAnalytics {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface KeyMetricsProps {
  spendingTrends: SpendingTrends;
  categoryAnalytics: CategoryAnalytics[];
  formatCurrency: (amount: number) => string;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  spendingTrends,
  categoryAnalytics,
  formatCurrency
}) => {
  const metrics = [
    {
      title: 'Avg Monthly Spending',
      value: formatCurrency(spendingTrends.averageSpending),
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: Math.abs(spendingTrends.monthlyChange).toFixed(1) + '%',
      trendIcon: spendingTrends.isIncreasing ? TrendingUp : TrendingDown,
      trendColor: spendingTrends.isIncreasing ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Current Savings Rate',
      value: formatCurrency(spendingTrends.bestSavingsMonth.balance),
      icon: Target,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: spendingTrends.savingsRate.toFixed(1) + '%',
      trendIcon: null,
      trendColor: spendingTrends.savingsRate > 20 ? 'text-green-600' : spendingTrends.savingsRate > 10 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: 'Top Spending Category',
      value: categoryAnalytics[0]?.category || 'N/A',
      icon: DollarSign,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: categoryAnalytics.length + ' Categories',
      trendIcon: null,
      trendColor: 'text-purple-600'
    },
    {
      title: 'Best Savings Month',
      value: spendingTrends.bestSavingsMonth.savings.toFixed(1) + '%',
      icon: Calendar,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: spendingTrends.bestSavingsMonth.fullMonth,
      trendIcon: null,
      trendColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trendIcon;
        
        return (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${metric.trendColor}`}>
                {TrendIcon && <TrendIcon className="w-4 h-4" />}
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-500">{metric.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default KeyMetrics;