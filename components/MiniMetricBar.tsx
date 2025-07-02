import React from 'react';

interface MiniMetricBarProps {
  label: string;
  value: number;
  color: string;
  percentage: boolean;
}

export default function MiniMetricBar({ label, value, color, percentage = true }: MiniMetricBarProps) {
  const displayValue = percentage ? Math.min(value * 100, 100) : value;
  const barWidth = percentage ? `${displayValue}%` : `${Math.min(value * 100, 100)}%`;
  
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 flex-grow">
        <div className="w-full bg-gray-200 rounded-full h-2 flex-grow">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              backgroundColor: color,
              width: barWidth
            }}
          />
        </div>
        <span className="text-sm font-medium flex-shrink-0 ml-2 min-w-[40px] text-right">
          {percentage ? `${displayValue.toFixed(0)}%` : displayValue.toFixed(1)}
        </span>
      </div>
    </div>
  );
}