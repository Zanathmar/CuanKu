// resources/js/Components/Analytics/IncomeVsExpensesChart.tsx
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface MonthlyData {
  month: string;
  amount: number;
  income: number;
  balance: number;
}

interface IncomeVsExpensesChartProps {
  data: MonthlyData[];
  formatCurrency: (amount: number) => string;
}

const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({
  data,
  formatCurrency
}) => {
  return (
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
          <AreaChart data={data}>
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
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              fill="url(#incomeGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#EF4444" 
              fill="url(#expenseGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeVsExpensesChart;