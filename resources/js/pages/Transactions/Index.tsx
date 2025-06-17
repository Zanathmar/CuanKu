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
      <Head title="Transactions" />
      
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 w-full lg:ml-64 p-3 sm:p-4 lg:p-8 overflow-hidden">
          {/* Flash Messages */}
          {flashMessages.map((message, index) => (
            <div 
              key={index}
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-green-50/90 border-green-500 text-green-700' 
                  : 'bg-red-50/90 border-red-500 text-red-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{message.message}</span>
                </div>
                <button
                  onClick={() => dismissFlashMessage(index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">Manage your financial activities</p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Fixed width for desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Income Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 font-medium">Total Income</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                  {showBalance ? formatCurrency(stats.totalIncome) : '••••••••'}
                </p>
                <div className="flex items-center mt-3 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>Income received</span>
                </div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
                  <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 font-medium">Total Expenses</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">
                  {showBalance ? formatCurrency(stats.totalExpenses) : '••••••••'}
                </p>
                <div className="flex items-center mt-3 text-sm text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>Money spent</span>
                </div>
              </div>
            </div>

            {/* Current Balance Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 font-medium">Current Balance</p>
                <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getBalanceColor()}`}>
                  {showBalance ? formatCurrency(stats.currentBalance) : '••••••••'}
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <PieChart className="w-4 h-4 mr-1" />
                  <span>{stats.transactionCount} transactions</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transactions Table - With horizontal scroll */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">  
            {/* Scrollable table container */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <TransactionsTable
                  expenses={expenses}
                  incomes={incomes}
                  onDelete={handleDelete}
                  processing={processing}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TransactionsIndex;