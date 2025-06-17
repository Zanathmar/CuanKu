// resources/js/Components/Analytics/CategoryBreakdownChart.tsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Eye } from 'lucide-react';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface CategoryBreakdownChartProps {
  data: CategoryData[];
  formatCurrency: (amount: number) => string;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  data,
  formatCurrency
}) => {
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
        <Eye className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="amount"
              label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;