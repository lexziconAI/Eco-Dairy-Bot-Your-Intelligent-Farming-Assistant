import React from 'react';
import { AnalysisResult } from '@/utils/api';
import ChartCaption from '@/components/ChartCaption';

interface SimpleLineChartProps {
  results: AnalysisResult;
  title: string;
  emoji: string;
  caption: string;
  transform?: (values: number[], index: number) => number[];
}

export default function SimpleLineChart({ results, title, emoji, caption, transform }: SimpleLineChartProps) {
  const seriesEntries = Object.entries(results.series || {});
  
  if (seriesEntries.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          {emoji} {title}
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-center py-8">No data available for visualization</p>
        </div>
      </div>
    );
  }

  const colors = ['#6366F1', '#A855F7', '#EC4899', '#22D3EE', '#F97316', '#10B981'];
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 40, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Process data
  const processedSeries = seriesEntries.map(([key, values], index) => {
    const processedValues = transform ? transform(values, index) : values;
    const maxValue = Math.max(...processedValues);
    const minValue = Math.min(...processedValues);
    const range = maxValue - minValue || 1;
    
    return {
      name: key.replace(/([a-z])([A-Z])/g, '$1 $2'),
      values: processedValues,
      normalizedValues: processedValues.map(v => (v - minValue) / range),
      color: colors[index % colors.length],
      maxValue,
      minValue
    };
  });

  const maxDataLength = Math.max(...processedSeries.map(s => s.values.length));
  const globalMax = Math.max(...processedSeries.map(s => s.maxValue));
  const globalMin = Math.min(...processedSeries.map(s => s.minValue));
  const globalRange = globalMax - globalMin || 1;

  // Create SVG paths
  const createPath = (values: number[]) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth;
      const normalizedValue = (value - globalMin) / globalRange;
      const y = chartHeight - (normalizedValue * chartHeight);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        {emoji} {title}
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {processedSeries.map((series) => (
            <div key={series.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: series.color }}
              />
              <span className="text-sm font-medium text-gray-700">{series.name}</span>
            </div>
          ))}
        </div>

        {/* SVG Line Chart */}
        <div className="overflow-x-auto">
          <svg width={width} height={height} className="border border-gray-100 rounded">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Chart area */}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <g key={ratio}>
                  <text
                    x={-10}
                    y={chartHeight - (ratio * chartHeight) + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500"
                  >
                    {((globalMin + ratio * globalRange)).toFixed(2)}
                  </text>
                  <line
                    x1={0}
                    y1={chartHeight - (ratio * chartHeight)}
                    x2={chartWidth}
                    y2={chartHeight - (ratio * chartHeight)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                </g>
              ))}
              
              {/* X-axis labels */}
              {Array.from({ length: Math.min(10, maxDataLength) }).map((_, i) => {
                const x = (i / 9) * chartWidth;
                const step = Math.floor((maxDataLength - 1) / 9);
                const value = i * step + 1;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {value}
                  </text>
                );
              })}
              
              {/* Data lines */}
              {processedSeries.map((series) => {
                const normalizedValues = series.values.map(v => (v - globalMin) / globalRange);
                return (
                  <path
                    key={series.name}
                    d={createPath(series.values)}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
              
              {/* Data points */}
              {processedSeries.map((series) => 
                series.values.map((value, index) => {
                  const x = (index / (series.values.length - 1)) * chartWidth;
                  const normalizedValue = (value - globalMin) / globalRange;
                  const y = chartHeight - (normalizedValue * chartHeight);
                  return (
                    <circle
                      key={`${series.name}-${index}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={series.color}
                      className="hover:r-6 transition-all duration-200"
                    >
                      <title>{`${series.name}: ${value.toFixed(3)} (Step ${index + 1})`}</title>
                    </circle>
                  );
                })
              )}
            </g>
            
            {/* Axis labels */}
            <text
              x={width / 2}
              y={height - 5}
              textAnchor="middle"
              className="text-sm fill-gray-600 font-medium"
            >
              Time Steps
            </text>
            <text
              x={15}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90, 15, ${height / 2})`}
              className="text-sm fill-gray-600 font-medium"
            >
              Value
            </text>
          </svg>
        </div>

        <ChartCaption>{caption}</ChartCaption>
      </div>
    </div>
  );
}