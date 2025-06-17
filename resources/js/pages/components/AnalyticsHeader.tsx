// resources/js/Components/Analytics/AnalyticsHeader.tsx
import React from 'react';
import { Download } from 'lucide-react';

interface TimeframeOption {
  label: string;
  value: string;
  months: number;
}

interface AnalyticsHeaderProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  onExport?: () => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  onExport
}) => {
  const timeframeOptions: TimeframeOption[] = [
    { label: '3M', value: '3M', months: 3 },
    { label: '6M', value: '6M', months: 6 },
    { label: '12M', value: '12M', months: 12 },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Deep insights into your financial patterns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTimeframeChange(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === option.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {onExport && (
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;