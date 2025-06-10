// resources/js/pages/Transactions/Index.tsx
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  AlertCircle, 
  X, 
  DollarSign,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TransactionsTable from '../components/TransactionsTable';

// Define the interfaces
export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface Stats {
  totalExpenses: number;
  totalIncome: number;
  currentBalance: number;
  transactionCount: number;
}

interface Props {
  expenses: Expense[];
  incomes: Income[];
  stats: Stats;
  flash?: {
    type: 'success' | 'error';
    message: string;
  }[];
}

const TransactionsIndex: React.FC<Props> = ({ expenses, incomes, stats, flash = [] }) => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [flashMessages, setFlashMessages] = useState(flash);
  
  // Form states
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Food'
  });
  
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: ''
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other'];
  const categoryColors = {
    Food: 'bg-orange-100 text-orange-800',
    Transport: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Health: 'bg-green-100 text-green-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  // Auto-hide flash messages
  useEffect(() => {
    if (flashMessages.length > 0) {
      const timer = setTimeout(() => {
        setFlashMessages([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMessages]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBalanceColor = () => {
    if (stats.currentBalance > 0) return 'text-green-600';
    if (stats.currentBalance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    router.post('/expenses', {
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category
    }, {
      onSuccess: () => {
        setIsExpenseModalOpen(false);
        setExpenseForm({ title: '', amount: '', category: 'Food' });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    router.post('/income', {
      title: incomeForm.title,
      amount: parseFloat(incomeForm.amount)
    }, {
      onSuccess: () => {
        setIsIncomeModalOpen(false);
        setIncomeForm({ title: '', amount: '' });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const handleDelete = (id: number, type: 'income' | 'expense') => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      setProcessing(true);
      
      const route = type === 'income' 
        ? `/income/${id}` 
        : `/expenses/${id}`;
      
      router.delete(route, {
        onFinish: () => setProcessing(false)
      });
    }
  };

  const closeModals = () => {
    setIsExpenseModalOpen(false);
    setIsIncomeModalOpen(false);
  };

  const dismissFlashMessage = (index: number) => {
    setFlashMessages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Head title="Transactions - CuanKu" />
      
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          {/* Flash Messages */}
          {flashMessages.map((message, index) => (
            <div 
              key={index}
              className={`mb-6 p-4 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-green-50/90 border-green-500 text-green-700' 
                  : 'bg-red-50/90 border-red-500 text-red-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {message.message}
                </div>
                <button
                  onClick={() => dismissFlashMessage(index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Manage your financial activities</p>
              </div>
              
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Balance</p>
                <p className={`text-2xl font-bold ${getBalanceColor()}`}>
                  {showBalance ? formatCurrency(stats.currentBalance) : '••••••'}
                </p>
              </div>
            </div>

            {/* Income Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(stats.totalIncome) : '••••••'}
                </p>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {showBalance ? formatCurrency(stats.totalExpenses) : '••••••'}
                </p>
              </div>
            </div>

            {/* Transactions Count */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
                <p className="text-2xl font-bold text-purple-600">{stats.transactionCount}</p>
              </div>
            </div>
          </div>
          

          {/* Transactions Table */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <TransactionsTable
              expenses={expenses}
              incomes={incomes}
              onDelete={handleDelete}
              processing={processing}
            />
          </div>

          {/* Add Expense Modal */}
          {isExpenseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-300 scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                      <ArrowDownRight className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Add New Expense</h3>
                  </div>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleExpenseSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expense Title
                    </label>
                    <input
                      type="text"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter expense title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Amount (IDR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </div>
                      ) : (
                        'Add Expense'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Income Modal */}
          {isIncomeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-300 scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Add New Income</h3>
                  </div>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleIncomeSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Income Source
                    </label>
                    <input
                      type="text"
                      value={incomeForm.title}
                      onChange={(e) => setIncomeForm({...incomeForm, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter income source"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Amount (IDR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </div>
                      ) : (
                        'Add Income'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default TransactionsIndex;