// components/TransactionsTable.tsx
import React, { useState } from 'react';
import { Receipt, Trash2, Filter, Search, MoreHorizontal, Calendar, Tag, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Expense } from '../Expenses/Index'; // Fixed import path

// Define Income interface to match your backend
interface Income {
  id: number;
  title: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Combined transaction type
interface Transaction {
  id: number;
  title: string;
  amount: number;
  created_at: string;
  updated_at: string;
  type: 'income' | 'expense';
  category?: string; // Only for expenses
}

interface TransactionsTableProps {
  expenses: Expense[];
  incomes?: Income[]; // Optional income array
  onDelete: (id: number, type: 'income' | 'expense') => void;
  onAddIncome?: () => void; // Function to open add income modal
  processing: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  expenses, 
  incomes = [], 
  onDelete, 
  onAddIncome,
  processing 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return '📦';
    const icons: Record<string, string> = {
      Food: '🍽️',
      Transport: '🚗',
      Entertainment: '🎬',
      Health: '🏥',
      Shopping: '🛍️',
      Other: '📦',
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800 border-gray-200';
    const colors: Record<string, string> = {
      Food: 'bg-orange-100 text-orange-800 border-orange-200',
      Transport: 'bg-blue-100 text-blue-800 border-blue-200',
      Entertainment: 'bg-purple-100 text-purple-800 border-purple-200',
      Health: 'bg-green-100 text-green-800 border-green-200',
      Shopping: 'bg-pink-100 text-pink-800 border-pink-200',
      Other: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Combine and transform expenses and incomes into unified transactions
  const allTransactions: Transaction[] = [
    ...expenses.map(expense => ({
      ...expense,
      type: 'expense' as const
    })),
    ...incomes.map(income => ({
      ...income,
      type: 'income' as const
    }))
  ];

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Fixed type filtering logic
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      
      // Category filtering should only apply to expenses and when a specific category is selected
      const matchesCategory = selectedCategory === 'all' || 
        (transaction.type === 'expense' && transaction.category === selectedCategory);
      
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categories = ['all', ...Array.from(new Set(expenses.map(e => e.category)))];

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Debug logging - you can remove this in production
  console.log('Debug Info:', {
    allTransactions: allTransactions.length,
    incomes: incomes.length,
    expenses: expenses.length,
    selectedType,
    filteredTransactions: filteredTransactions.length,
    incomeTransactions: allTransactions.filter(t => t.type === 'income').length
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
              <p className="text-sm text-gray-500">
                {filteredTransactions.length} of {allTransactions.length} transactions
              </p>
            </div>
          </div>
          
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
            disabled={selectedType === 'income'}
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="mt-2 text-xs text-gray-500">
          Debug: {allTransactions.length} total, {incomes.length} incomes, {expenses.length} expenses
        </div>
      </div>

      {/* Sorting Options */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sortBy === 'date') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('date');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'amount') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('amount');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'amount' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'title') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('title');
                  setSortOrder('asc');
                }
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'title' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Title {sortBy === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first transaction'
              }
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={`${transaction.type}-${transaction.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                        <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.type === 'expense' && transaction.category ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(transaction.category)}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {transaction.category}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDelete(transaction.id, transaction.type)}
                        disabled={processing}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer with summary */}
      {filteredTransactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex justify-between items-center sm:col-span-1">
              <span className="text-sm text-gray-600">Transactions:</span>
              <span className="text-sm font-medium text-gray-900">{filteredTransactions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Income:</span>
              <span className="text-sm font-medium text-green-600">+{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expenses:</span>
              <span className="text-sm font-medium text-red-600">-{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;