import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusCircle, Wallet } from 'lucide-react';

// Components
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCard';
import ChartsSection from '../components/ChartSection';
import TransactionsTable from '../components/TransactionsTable';
import SidebarStats from '../components/SidebarStats';
import ExpenseModal from '../components/ExpenseModal';
import FlashMessage from '../components/FlashMessage';
import { Button } from '../components/Button';
import BalanceModal from '../components/BallanceModal';

// Types
export interface Expense {
  id: number;
  title: string;
  amount: number;
  created_at: string;
  updated_at: string;
  category: string;
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface CategoryData {
  category: string;
  amount: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
}

export interface Stats {
  totalExpenses: number;
  totalIncome: number;
  currentBalance: number;
  transactionCount: number;
}

export interface Flash {
  type?: string;
  message?: string;
}

interface PageProps {
  expenses: Expense[];
  incomes: Income[];
  stats: Stats;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  flash: Flash;
}

const Index: React.FC<PageProps> = ({
  expenses,
  incomes,
  stats,
  monthlyData,
  categoryData,
  flash
}) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    amount: '',
    category: 'Food',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/expenses', {
      onSuccess: () => {
        setShowExpenseForm(false);
        reset();
      },
    });
  };

  const handleDelete = (id: number, type: 'income' | 'expense') => {
    if (type === 'income') {
      router.delete(`/income/${id}`);
    } else {
      router.delete(`/expenses/${id}`);
    }
  };

  const handleQuickTransaction = (formData: { title: string; amount: string; category: string }) => {
    post('/expenses', {
      ...formData,
      onSuccess: () => {},
    });
  };

  return (
    <>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <FlashMessage flash={flash} />
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 pt-16 lg:pt-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Track and manage your expenses efficiently</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Add Balance Button (styled like Income) */}
              <Button 
                onClick={() => setShowBalanceForm(true)}
                variant="secondary"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
              >
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden xs:inline">Add Balance</span>
                <span className="xs:hidden">Add Income</span>
              </Button>

              {/* Add Expense Button */}
              <Button onClick={() => setShowExpenseForm(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700'>
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden xs:inline">New Expense</span>
                <span className="xs:hidden">New Expense</span>
              </Button>
            </div>
          </div>

          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
              <ChartsSection monthlyData={monthlyData} />
              <TransactionsTable
                expenses={expenses}
                incomes={incomes}
                onDelete={handleDelete}
                onAddIncome={() => setShowBalanceForm(true)}
                processing={processing}
              />
            </div>

            <div className="space-y-6">
              <SidebarStats
                categoryData={categoryData}
                onQuickTransaction={handleQuickTransaction}
                processing={processing}
              />
            </div>
          </div>

          {/* Expense Modal */}
          <ExpenseModal
            showForm={showExpenseForm}
            setShowForm={setShowExpenseForm}
            data={data}
            setData={setData}
            handleSubmit={handleSubmit}
            processing={processing}
            errors={errors}
          />

          {/* Balance Modal */}
          <BalanceModal
            showForm={showBalanceForm}
            setShowForm={setShowBalanceForm}
          />
        </div>
      </div>
    </>
  );
};

export default Index;