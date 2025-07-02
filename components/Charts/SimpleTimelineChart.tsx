import React from 'react';
import { AnalysisResult } from '@/utils/api';
import ChartCaption from '@/components/ChartCaption';

interface SimpleTimelineChartProps {
  results: AnalysisResult;
  title: string;
  emoji: string;
  caption: string;
}

export default function SimpleTimelineChart({ results, title, emoji, caption }: SimpleTimelineChartProps) {
  // Extract and validate data
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

  // Prepare data for visualization
  const maxLength = Math.max(...seriesEntries.map(([_, values]) => values.length));
  const colors = ['#6366F1', '#A855F7', '#EC4899', '#22D3EE', '#F97316', '#10B981'];
  
  // Create timeline points
  const timelinePoints = Array.from({ length: maxLength }, (_, i) => {
    const point: any = { index: i };
    seriesEntries.forEach(([key, values], metricIndex) => {
      const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
      point[formattedKey] = {
        value: values[i] || 0,
        color: colors[metricIndex % colors.length]
      };
    });
    return point;
  });

  const metricNames = seriesEntries.map(([key]) => 
    key.replace(/([a-z])([A-Z])/g, '$1 $2')
  );

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        {emoji} {title}
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {metricNames.map((name, index) => (
            <div key={name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>
          ))}
        </div>

        {/* Simple Bar Chart Timeline */}
        <div className="space-y-4">
          {timelinePoints.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 text-xs text-gray-500 text-right">
                {index + 1}
              </div>
              <div className="flex-1 flex items-center gap-1 h-6">
                {metricNames.map((metricName) => {
                  const data = point[metricName];
                  const width = Math.max(data.value * 100, 2); // Minimum 2% width for visibility
                  return (
                    <div
                      key={metricName}
                      className="h-full rounded transition-all duration-300 hover:opacity-80"
                      style={{
                        backgroundColor: data.color,
                        width: `${width}%`,
                        opacity: 0.8
                      }}
                      title={`${metricName}: ${(data.value * 100).toFixed(1)}%`}
                    />
                  );
                })}
              </div>
              <div className="w-12 text-xs text-gray-500">
                {(Object.values(point)
                  .filter(v => v && typeof v === 'object' && 'value' in v)
                  .reduce((sum: number, v: any, _, arr) => sum + v.value / arr.length, 0) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        <ChartCaption>{caption}</ChartCaption>
      </div>
    </div>
  );
}