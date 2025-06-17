// resources/js/Components/Analytics/CategoryDetails.tsx
import React from 'react';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface CategoryDetailsProps {
  data: CategoryData[];
  formatCurrency: (amount: number) => string;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  data,
  formatCurrency
}) => {
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Category Details</h3>
        <p className="text-gray-600 mt-1">Detailed breakdown of your spending categories</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {data.map((category, index) => (
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
  );
};

export default CategoryDetails;