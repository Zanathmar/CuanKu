// components/ChartsSection.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Filter } from 'lucide-react';
import { MonthlyData } from '../Expenses/Index';

interface ChartsSectionProps {
  monthlyData: MonthlyData[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ monthlyData }) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [timeframe, setTimeframe] = useState('6M');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const customTooltipFormatter = (value: any): [string, string] => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return [formatCurrency(numValue), 'Expenses'];
  };

  const timeframes = [
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'all' },
  ];

  // Calculate trend
  const currentMonth = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonth = monthlyData[monthlyData.length - 2]?.amount || 0;
  const trend = previousMonth !== 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Expense Overview</h2>
            <p className="text-sm text-gray-500">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}% from last month
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'line'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'area'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Area
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === tf.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={customTooltipFormatter}
                labelStyle={{ color: '#666' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={customTooltipFormatter}
                labelStyle={{ color: '#666' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUv)" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(Math.max(...monthlyData.map(d => d.amount)))}
            </div>
            <div className="text-xs text-gray-500">Highest</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(Math.min(...monthlyData.map(d => d.amount)))}
            </div>
            <div className="text-xs text-gray-500">Lowest</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(monthlyData.reduce((a, b) => a + b.amount, 0) / monthlyData.length)}
            </div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {monthlyData.length}
            </div>
            <div className="text-xs text-gray-500">Months</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;