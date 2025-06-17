// resources/js/Components/Analytics/SavingsProgress.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface MonthlyData {
  month: string;
  savings: number;
}

interface SavingsProgressProps {
  data: MonthlyData[];
}

const SavingsProgress: React.FC<SavingsProgressProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Savings Progress</h3>
        <p className="text-gray-600 mt-1">Track your monthly savings performance</p>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${value.toFixed(0)}%`} 
              />
              <Tooltip 
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Savings Rate']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px' 
                }}
              />
              <Bar dataKey="savings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SavingsProgress;