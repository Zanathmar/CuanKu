// components/ExpenseModal.tsx
import React, { useEffect } from 'react';
import { X, Receipt, DollarSign, Tag, Calendar, Plus } from 'lucide-react';

interface ExpenseModalProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  data: { title: string; amount: string; category: string };
  setData: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  processing: boolean;
  errors: Record<string, string>;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  showForm,
  setShowForm,
  data,
  setData,
  handleSubmit,
  processing,
  errors
}) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showForm, setShowForm]);

  // Format number input for better UX
  const formatNumberInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberInput(e.target.value);
    setData('amount', formattedValue);
  };

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
    }
  };

  if (!showForm) return null;

  const categories = [
    { value: 'Food', label: 'Food', icon: '🍽️', color: 'from-orange-400 to-orange-500' },
    { value: 'Transport', label: 'Transport', icon: '🚗', color: 'from-blue-400 to-blue-500' },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎬', color: 'from-purple-400 to-purple-500' },
    { value: 'Health', label: 'Health', icon: '🏥', color: 'from-green-400 to-green-500' },
    { value: 'Shopping', label: 'Shopping', icon: '🛍️', color: 'from-pink-400 to-pink-500' },
    { value: 'Other', label: 'Other', icon: '📦', color: 'from-gray-400 to-gray-500' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Responsive sizing */}
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-2 sm:mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in duration-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        
        {/* Header - Responsive padding and layout */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Expense</h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Track your spending</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form - Responsive spacing and layout */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span>Expense Title</span>
              </div>
            </label>
            <input
              type="text"
              placeholder="e.g., Lunch at restaurant, Gas for car..."
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-slate-900 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-base ${
                errors.title 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Amount (IDR)</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="50,000"
                value={data.amount}
                onChange={handleAmountChange}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-slate-900 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-base ${
                  errors.amount 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.amount}
              </p>
            )}
            {data.amount && !errors.amount && (
              <p className="text-gray-500 text-sm mt-2">
                Amount: {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(data.amount) || 0)}
              </p>
            )}
          </div>

          {/* Category Selection - Responsive grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setData('category', category.value)}
                  className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 flex items-center gap-2 sm:gap-3 touch-manipulation min-h-[48px] ${
                    data.category === category.value
                      ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <span className="text-lg sm:text-xl flex-shrink-0">{category.icon}</span>
                  <span className="font-medium text-gray-700 text-xs sm:text-sm text-left leading-tight">{category.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="w-4 h-4 text-red-500">⚠️</span>
                {errors.category}
              </p>
            )}
          </div>

          {/* Quick Amount Suggestions - Responsive layout */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Quick Amounts</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['10000', '25000', '50000', '100000'].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setData('amount', amount)}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors touch-manipulation min-h-[40px] flex items-center justify-center"
                >
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: 'compact'
                  }).format(Number(amount))}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={processing || !data.title.trim() || !data.amount}
              className="w-full flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Expense</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 font-semibold touch-manipulation min-h-[48px]"
            >
              Cancel
            </button>
          </div>

          {/* Form Footer Info - Responsive text */}
          <div className="pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="leading-relaxed">Transaction will be recorded with current date and time</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;