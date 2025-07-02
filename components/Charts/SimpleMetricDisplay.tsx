import React from 'react';
import { ConversationDataStore } from '@/utils/conversationDataStore';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  emoji: string;
}

function MetricCard({ title, value, subtitle, color, emoji }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 text-center`}>
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium">{title}</div>
      {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
    </div>
  );
}

interface GaugeProps {
  title: string;
  value: number; // 0 to 1
  color: string;
  emoji: string;
  description: string;
}

function SimpleGauge({ title, value, color, emoji, description }: GaugeProps) {
  const percentage = Math.round(value * 100);
  
  return (
    <div className="text-center">
      <div className="text-xl mb-2">{emoji}</div>
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#e5e7eb"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 10}`}
            strokeDashoffset={`${2 * Math.PI * 10 * (1 - value)}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{percentage}%</span>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-800">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{description}</div>
    </div>
  );
}

interface SimpleMetricDisplayProps {
  conversationData: ConversationDataStore;
  title: string;
  emoji: string;
}

export default function SimpleMetricDisplay({ 
  conversationData, 
  title, 
  emoji 
}: SimpleMetricDisplayProps) {
  const { exchanges, metrics } = conversationData;
  
  if (exchanges.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          {emoji} {title}
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="text-center py-8 text-gray-500">
            Start a conversation to see your farming insights emerge.
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate key metrics for display
  const latestExchange = exchanges[exchanges.length - 1];
  const firstExchange = exchanges[0];
  
  // Topic diversity trend
  const topicDiversityTrend = exchanges.length > 1 
    ? latestExchange.analysis.topicDiversity - firstExchange.analysis.topicDiversity
    : 0;
  
  // Most common themes
  const allThemes = exchanges.flatMap(e => e.analysis.themes);
  const themeFrequency = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topThemes = Object.entries(themeFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);
  
  // Orientation stability
  const orientations = exchanges.map(e => e.analysis.orientation);
  const orientationChanges = orientations.slice(1).filter((curr, i) => curr !== orientations[i]).length;
  const orientationStability = exchanges.length > 1 ? 1 - (orientationChanges / (exchanges.length - 1)) : 1;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        {emoji} {title}
        <span className="text-sm text-blue-600 font-normal">
          ({exchanges.length} Exchange{exchanges.length !== 1 ? 's' : ''})
        </span>
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Exchanges"
            value={exchanges.length}
            subtitle="Conversation depth"
            color="blue"
            emoji="💬"
          />
          
          <MetricCard
            title="Topics Discussed"
            value={topThemes.length}
            subtitle={topThemes.join(', ') || 'None detected'}
            color="green"
            emoji="🌱"
          />
          
          <MetricCard
            title="Avg Complexity"
            value={`${Math.round(metrics.averageComplexity * 100)}%`}
            subtitle="Conversation depth"
            color="purple"
            emoji="🧠"
          />
          
          <MetricCard
            title="Current Orientation"
            value={latestExchange.analysis.orientation}
            subtitle="Farming approach"
            color="orange"
            emoji="🎯"
          />
        </div>
        
        {/* Detailed Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SimpleGauge
            title="Topic Diversity"
            value={latestExchange.analysis.topicDiversity}
            color="#6366F1"
            emoji="🌍"
            description="Range of farming concerns discussed"
          />
          
          <SimpleGauge
            title="Narrative Coherence"
            value={metrics.narrativeTypeDistribution.grandNarrative}
            color="#10B981"
            emoji="📖"
            description="How structured your story is"
          />
          
          <SimpleGauge
            title="Orientation Stability"
            value={orientationStability}
            color="#F59E0B"
            emoji="⚖️"
            description="Consistency in farming approach"
          />
        </div>
        
        {/* Exchange Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Exchange Breakdown:</h4>
          {exchanges.map((exchange, index) => (
            <div key={exchange.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-800">Exchange {index + 1}</span>
                <span className="text-sm text-gray-500">
                  {exchange.analysis.themes.length} themes
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Orientation:</span>
                  <div className="font-medium">{exchange.analysis.orientation}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">Complexity:</span>
                  <div className="font-medium">{Math.round(exchange.analysis.complexity * 100)}%</div>
                </div>
                
                <div>
                  <span className="text-gray-600">Sentiment:</span>
                  <div className="font-medium">
                    {exchange.analysis.sentiment > 0.1 ? '😊 Positive' : 
                     exchange.analysis.sentiment < -0.1 ? '😟 Concerned' : '😐 Neutral'}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exchange.analysis.themes.slice(0, 2).map(theme => (
                      <span key={theme} className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">
                        {theme}
                      </span>
                    ))}
                    {exchange.analysis.themes.length > 2 && (
                      <span className="text-xs text-gray-500">+{exchange.analysis.themes.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Insights */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            💡 Initial Insights
          </h4>
          <div className="text-sm text-green-700 space-y-2">
            <p>
              <strong>Your farming approach:</strong> {latestExchange.analysis.orientation === 'P-R' ? 
                'Pragmatic and cautious about change' :
                latestExchange.analysis.orientation === 'P-NR' ?
                'Pragmatic but open to innovation' :
                'Environmentally focused'
              }
            </p>
            
            {topThemes.length > 0 && (
              <p>
                <strong>Main concerns:</strong> You're primarily focused on {topThemes.join(', ')}
              </p>
            )}
            
            {exchanges.length >= 2 && (
              <p>
                <strong>Conversation evolution:</strong> Your topic diversity has {
                  topicDiversityTrend > 0.1 ? 'increased significantly' :
                  topicDiversityTrend < -0.1 ? 'become more focused' :
                  'remained consistent'
                } across exchanges.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}