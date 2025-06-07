// components/StatsCards.tsx
import React from 'react';
import { DollarSign, TrendingUp, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Stats } from '../Expenses/Index';

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Current Balance',
      value: formatCurrency(stats.currentBalance),
      subtitle: 'Available balance',
      icon: DollarSign,
      bgColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: '+2.5%',
      trendUp: true,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      subtitle: `${stats.transactionCount} transactions`,
      icon: TrendingUp,
      bgColor: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: '-1.2%',
      trendUp: false,
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      subtitle: 'Monthly income',
      icon: Receipt,
      bgColor: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: '+8.1%',
      trendUp: true,
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
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
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

            {/* Progress bar for visual appeal */}
            <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
              <div 
                className={`bg-gradient-to-r ${card.bgColor} h-1 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((index + 1) * 30, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;