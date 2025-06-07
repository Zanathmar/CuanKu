// components/BalanceModal.tsx
import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Wallet, DollarSign, TrendingUp, Plus, FileText } from 'lucide-react';

interface BalanceModalProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ showForm, setShowForm }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    amount: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/balance', {
      onSuccess: () => {
        setShowForm(false);
        reset();
      }
    });
  };

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
    }
  };

  // Quick amount suggestions with auto-generated titles
  const handleQuickAmount = (amount: string) => {
    setData('amount', amount);
    // Auto-generate title based on amount
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(Number(amount));
    setData('title', `Income ${formattedAmount}`);
  };

  if (!showForm) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Responsive sizing */}
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in duration-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        
        {/* Header - Responsive padding and layout */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add Income</h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Record your income source</p>
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
                <FileText className="w-4 h-4" />
                <span>Income Source</span>
              </div>
            </label>
            <input
              type="text"
              placeholder="e.g., Salary, Freelance, Business, etc."
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-slate-900 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-base ${
                errors.title 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              required
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
                placeholder="100,000"
                value={data.amount}
                onChange={handleAmountChange}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-slate-900 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-base ${
                  errors.amount 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
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

          {/* Quick Amount Suggestions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Quick Amounts</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { amount: '50000', label: 'Rp50K' },
                { amount: '100000', label: 'Rp100K' },
                { amount: '250000', label: 'Rp250K' },
                { amount: '500000', label: 'Rp500K' }
              ].map(({ amount, label }) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAmount(amount)}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 active:bg-green-200 rounded-lg transition-colors touch-manipulation min-h-[40px] flex items-center justify-center border border-green-200 hover:border-green-300"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-800 mb-1">Income Tracking</h4>
                <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                  Recording your income helps maintain accurate balance calculations and better financial insights.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={processing || !data.amount || !data.title}
              className="w-full flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding Income...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Income</span>
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
        </form>
      </div>
    </div>
  );
};

export default BalanceModal;