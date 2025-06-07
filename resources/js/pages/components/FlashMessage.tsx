// components/FlashMessage.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface FlashMessageProps {
  flash: {
    type?: string;
    message?: string;
  };
}

const FlashMessage: React.FC<FlashMessageProps> = ({ flash }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (flash.message && flash.type) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [flash.message, flash.type]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible || !flash.message || !flash.type) {
    return null;
  }

  const getMessageConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          progressColor: 'bg-green-600',
        };
      case 'error':
      case 'danger':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          progressColor: 'bg-red-600',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          progressColor: 'bg-yellow-600',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          progressColor: 'bg-blue-600',
        };
    }
  };

  const config = getMessageConfig(flash.type);
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div
        className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-xl shadow-lg transform transition-all duration-300 ${
          isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        {/* Progress bar */}
        <div className="relative overflow-hidden">
          <div
            className={`h-1 ${config.progressColor} transform origin-left transition-transform duration-5000 ease-linear ${
              isAnimating ? 'scale-x-0' : 'scale-x-100'
            }`}
          />
        </div>

        {/* Message content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm capitalize">
                    {flash.type === 'success' && 'Success!'}
                    {flash.type === 'error' && 'Error!'}
                    {flash.type === 'danger' && 'Error!'}
                    {flash.type === 'warning' && 'Warning!'}
                    {flash.type === 'info' && 'Info'}
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed">
                    {flash.message}
                  </p>
                </div>
                
                <button
                  onClick={handleClose}
                  className={`flex-shrink-0 p-1 rounded-lg transition-colors ${config.textColor} hover:bg-black hover:bg-opacity-10`}
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;