import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

interface SentimentJourneyGraphProps {
  data: Array<{ timestamp: number; sentiment: number; topic?: string }>;
  title?: string;
}

export default function SentimentJourneyGraph({ 
  data, 
  title = "Sentiment Journey Through Conversation" 
}: SentimentJourneyGraphProps) {
  // Transform data for visualization
  const chartData = data.map((point, index) => ({
    step: index + 1,
    sentiment: point.sentiment,
    timestamp: point.timestamp,
    topic: point.topic || `Step ${index + 1}`,
    // Normalize sentiment to 0-100 scale for better visualization
    displayValue: ((point.sentiment + 1) / 2) * 100
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`Step ${label}`}</p>
          <p className="text-sm text-gray-600">{data.topic}</p>
          <p className="text-sm">
            <span className="font-medium">Sentiment: </span>
            <span className={`${data.sentiment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.sentiment >= 0 ? 'Positive' : 'Negative'} ({data.sentiment.toFixed(2)})
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          📈 {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Track how sentiment evolves throughout the conversation
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="step" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft' }}
            />
            
            {/* Zero baseline reference line */}
            <ReferenceLine 
              y={50} 
              stroke="#6B7280" 
              strokeDasharray="5 5"
              label={{ value: "Neutral", position: "insideTopRight" }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="displayValue"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#sentimentGradient)"
              dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>How to read:</strong> Positive values indicate optimistic, confident sentiment. 
          Negative values suggest concern, hesitation, or frustration. 
          The area shading helps visualize the emotional journey.
        </p>
      </div>
    </div>
  );
}