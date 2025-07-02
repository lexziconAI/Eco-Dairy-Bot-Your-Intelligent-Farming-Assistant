import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalysisResult } from '@/utils/api';
import ChartCaption from '@/components/ChartCaption';

interface ComplexityEmergenceTimelineProps {
  results: AnalysisResult;
}

export default function ComplexityEmergenceTimeline({ results }: ComplexityEmergenceTimelineProps) {
  // Debug logging
  console.log('ComplexityEmergenceTimeline data debug:', {
    seriesKeys: Object.keys(results.series || {}),
    seriesValues: Object.values(results.series || {}),
    seriesFirst: Object.entries(results.series || {})[0],
    hasData: Object.keys(results.series || {}).length > 0
  });

  // Generate timeline data from series
  const timelineData = React.useMemo(() => {
    if (results.timelineData) {
      return results.timelineData;
    }
    
    // Fallback: generate from series data
    const seriesEntries = Object.entries(results?.series || {});
    if (seriesEntries.length === 0) return [];
    
    const maxLength = Math.max(...Object.values(results?.series || {}).map(arr => arr.length));
    
    return Array.from({ length: maxLength }, (_, i) => {
      const dataPoint: any = { step: i + 1 };
      seriesEntries.forEach(([key, values]) => {
        // Use original key for data matching, but format for display
        dataPoint[key] = values[i] || 0;
      });
      return dataPoint;
    });
  }, [results]);

  console.log('Timeline data generated:', {
    timelineDataLength: timelineData.length,
    firstDataPoint: timelineData[0],
    lastDataPoint: timelineData[timelineData.length - 1]
  });

  const palette = ['#6366F1', '#A855F7', '#EC4899', '#22D3EE', '#F97316', '#10B981'];
  
  // Get original keys for data, formatted keys for display
  const metricKeys = Object.keys(results?.series || {});
  const formattedMetricNames = metricKeys.map(key => 
    key.replace(/([a-z])([A-Z])/g, '$1 $2')
  );

  // Don't render if no data
  if (metricKeys.length === 0 || timelineData.length === 0) {
    console.log('No data to render in ComplexityEmergenceTimeline');
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          📈 Complexity Emergence Timeline
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-center py-8">No data available for timeline visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        📈 Complexity Emergence Timeline
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <div className="h-80 w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={timelineData} 
                margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
                role="img"
                aria-label="Complexity emergence timeline showing how different metrics evolve over time"
              >
                <defs>
                  {metricKeys.map((key, index) => (
                    <linearGradient key={key} id={`timeline-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={palette[index % palette.length]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={palette[index % palette.length]} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                
                <XAxis 
                  dataKey="step" 
                  interval={0} 
                  height={40} 
                  tickMargin={8} 
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                
                <YAxis 
                  domain={[0, 'auto']} 
                  width={50} 
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.875rem'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                
                {metricKeys.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={formattedMetricNames[index]}
                    stackId="complexity"
                    stroke={palette[index % palette.length]}
                    fill={`url(#timeline-gradient-${index})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <ChartCaption>
          Thanks for sharing your thoughts—this timeline reveals how different aspects of your situation 
          develop and interact over time. Each colored area represents a key metric from your narrative, 
          stacked to show their cumulative complexity. Higher peaks indicate periods of greater intensity 
          or change, while stable areas suggest consistency in those themes.
        </ChartCaption>
      </div>
    </div>
  );
}