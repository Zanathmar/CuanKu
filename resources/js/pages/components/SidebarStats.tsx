// components/SidebarStats.tsx
import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart, Zap, Plus } from 'lucide-react';
import { CategoryData } from '../Expenses/Index';

interface SidebarStatsProps {
  categoryData: CategoryData[];
  onQuickTransaction: (formData: { title: string; amount: string; category: string }) => void;
  processing: boolean;
}

const SidebarStats: React.FC<SidebarStatsProps> = ({ 
  categoryData, 
  onQuickTransaction, 
  processing 
}) => {
  const [quickForm, setQuickForm] = useState({
    title: '',
    amount: '',
    category: 'Food'
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pieTooltipFormatter = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return formatCurrency(numValue);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickTransaction(quickForm);
    setQuickForm({ title: '', amount: '', category: 'Food' });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      Food: '🍽️',
      Transport: '🚗',
      Entertainment: '🎬',
      Health: '🏥',
      Shopping: '🛍️',
      Other: '📦',
    };
    return emojis[category as keyof typeof emojis] || '📦';
  };

  const topCategories = categoryData.slice(0, 5);
  const totalAmount = categoryData.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="space-y-6">
      {/* Most Expenses Categories */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Top Categories</h3>
              <p className="text-xs text-gray-500">Highest spending</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {topCategories.map((category, index) => {
            const percentage = totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0;
            
            return (
              <div key={category.category} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryEmoji(category.category)}</span>
                      <span className="font-medium text-gray-700">{category.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">
                      {formatCurrency(category.amount).replace('Rp', '').trim()}
                    </div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 group-hover:shadow-sm"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Distribution</h3>
              <p className="text-xs text-gray-500">Expense breakdown</p>
            </div>
          </div>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => pieTooltipFormatter(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((category, index) => (
              <div key={category.category} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-gray-600 truncate">{category.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Transaction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Quick Add</h3>
            <p className="text-xs text-gray-600">Fast transaction entry</p>
          </div>
        </div>
        
        <form onSubmit={handleQuickSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What did you buy?"
              value={quickForm.title}
              onChange={e => setQuickForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 text-slate-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <input
              type="number"
              placeholder="Amount (IDR)"
              value={quickForm.amount}
              onChange={e => setQuickForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-3 text-slate-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <select
              value={quickForm.category}
              onChange={e => setQuickForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 text-slate-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Food">🍽️ Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Health">🏥 Health</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>
          
          <button 
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Expense
              </>
            )}
          </button>
        </form>
      </div>

      {/* Insights Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">💡</span>
          </div>
          <h4 className="font-bold text-gray-900">Smart Insight</h4>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Your highest spending category is <strong>{categoryData[0]?.category || 'N/A'}</strong>. 
          Consider setting a monthly budget to better control your expenses.
        </p>
      </div>
    </div>
  );
};

export default SidebarStats;