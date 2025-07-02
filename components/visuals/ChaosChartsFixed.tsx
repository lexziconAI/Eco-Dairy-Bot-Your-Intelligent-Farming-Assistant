import React from 'react';
import { AnalysisResult } from '@/utils/api';
import { ConversationDataStore, createConversationDataStore } from '@/utils/conversationDataStore';
import ChartContainer from '@/components/Charts/ChartContainer';
import SimpleMetricDisplay from '@/components/Charts/SimpleMetricDisplay';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import MiniMetricBar from '@/components/MiniMetricBar';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ChaosChartsProps {
  results: AnalysisResult;
  conversationHistory?: Message[];
}

export default function ChaosChartsFixed({ results, conversationHistory }: ChaosChartsProps) {
  // Create conversation data store
  const conversationData = React.useMemo(() => {
    if (!conversationHistory) {
      return {
        exchanges: [],
        metrics: {
          totalExchanges: 0,
          orientationJourney: [],
          narrativeTypeDistribution: { antenarrative: 0, grandNarrative: 0, livingStory: 0 },
          averageComplexity: 0,
          topicEvolution: [],
          sentimentJourney: []
        },
        metadata: {
          startTime: new Date(),
          lastUpdated: new Date(),
          isComplete: false
        }
      };
    }
    
    return createConversationDataStore(conversationHistory);
  }, [conversationHistory]);

  const { exchanges } = conversationData;

  // For very short conversations, show simplified metrics
  if (exchanges.length < 2) {
    return (
      <SimpleMetricDisplay
        conversationData={conversationData}
        title="Chaos Theory Insights"
        emoji="🌀"
      />
    );
  }

  // Calculate chaos-specific metrics for actual exchanges
  const chaosData = exchanges.map((exchange, index) => ({
    label: `Exchange ${index + 1}`,
    entropy: exchange.analysis.emotionalVolatility * 0.7 + exchange.analysis.topicDiversity * 0.3,
    emergence: exchange.analysis.narrativeTension * 0.6 + exchange.analysis.complexity * 0.4,
    divergence: Math.abs(exchange.analysis.sentiment) * 0.5 + exchange.analysis.uncertaintyMarkers / 10,
    systemInstability: (exchange.analysis.antenarrative + exchange.analysis.narrativeTension) / 2,
    adaptiveCapacity: (exchange.analysis.livingStory + exchange.analysis.topicDiversity) / 2
  }));

  // Calculate system divergence from initial state
  const divergenceData = exchanges.map((exchange, index) => {
    const initialComplexity = exchanges[0].analysis.complexity;
    const initialSentiment = exchanges[0].analysis.sentiment;
    const initialTopicDiversity = exchanges[0].analysis.topicDiversity;
    
    return {
      label: `Exchange ${index + 1}`,
      complexityDivergence: Math.abs(exchange.analysis.complexity - initialComplexity),
      sentimentDivergence: Math.abs(exchange.analysis.sentiment - initialSentiment),
      topicDivergence: Math.abs(exchange.analysis.topicDiversity - initialTopicDiversity)
    };
  });

  // Generate insights
  const patterns: string[] = [];
  const interpretations: string[] = [];
  const actionableAdvice: string[] = [];

  // Analyze entropy trends
  const avgEntropy = chaosData.reduce((sum, d) => sum + d.entropy, 0) / chaosData.length;
  if (avgEntropy > 0.7) {
    patterns.push("High system entropy - lots of variability and change");
    interpretations.push("Your farming approach is evolving and adapting rapidly");
    actionableAdvice.push("Consider documenting key insights before they're lost in the complexity");
  }

  // Check for emergence patterns
  const emergenceTrend = chaosData.length > 1 ? 
    chaosData[chaosData.length - 1].emergence - chaosData[0].emergence : 0;
  if (emergenceTrend > 0.3) {
    patterns.push("Increasing emergence - new patterns developing");
    interpretations.push("Your understanding is evolving beyond initial assumptions");
  }

  // Check system stability
  const avgInstability = chaosData.reduce((sum, d) => sum + d.systemInstability, 0) / chaosData.length;
  if (avgInstability > 0.6) {
    patterns.push("High system instability with significant narrative tensions");
    interpretations.push("You're wrestling with competing approaches to farming");
    actionableAdvice.push("Focus on identifying your core values to guide decision-making");
  }

  return (
    <div className="space-y-8">
      {/* Chaos Dynamics Evolution - REAL DATA ONLY */}
      <ChartContainer
        title="Chaos Dynamics Evolution"
        emoji="🌀"
        conversationData={conversationData}
        minimumExchanges={2}
        technicalExplanation={{
          description: "How chaos-theoretic properties (entropy, emergence, instability) evolve across actual conversation exchanges",
          dataSource: "Real exchange analysis - each point represents one user-bot interaction",
          scaleInfo: "Y-axis: 0-100% chaos intensity. Higher values indicate more complex, unpredictable dynamics."
        }}
        personalInsights={{
          patterns,
          interpretations,
          actionableAdvice
        }}
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chaosData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis 
                domain={[0, 1]} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: 'Chaos Intensity', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `${(value * 100).toFixed(1)}%`,
                  name.replace(/([A-Z])/g, ' $1').trim()
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="entropy" 
                stroke="#9F7AEA" 
                strokeWidth={3}
                name="System Entropy"
              />
              <Line 
                type="monotone" 
                dataKey="emergence" 
                stroke="#A855F7" 
                strokeWidth={3}
                name="Pattern Emergence"
              />
              <Line 
                type="monotone" 
                dataKey="systemInstability" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="System Instability"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* System Divergence Patterns - REAL DATA ONLY */}
      <ChartContainer
        title="System Divergence Patterns"
        emoji="📈"
        conversationData={conversationData}
        minimumExchanges={2}
        technicalExplanation={{
          description: "How your conversation patterns diverge from initial starting points, showing system evolution",
          dataSource: "Calculated from actual exchange differences - each point shows divergence from Exchange 1",
          scaleInfo: "Y-axis: divergence magnitude. Higher values mean greater change from initial state."
        }}
        personalInsights={{
          patterns: ["Tracks how your thinking evolves during conversation"],
          interpretations: ["Shows if you're consistent or exploring new territory"],
          actionableAdvice: ["High divergence suggests openness to new ideas"]
        }}
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={divergenceData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis 
                domain={[0, 'dataMax']} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: 'Divergence from Initial State', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  value.toFixed(3),
                  name.replace(/([A-Z])/g, ' $1').replace('Divergence', '').trim()
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="complexityDivergence" 
                stroke="#6366F1" 
                strokeWidth={3}
                name="Complexity Divergence"
              />
              <Line 
                type="monotone" 
                dataKey="sentimentDivergence" 
                stroke="#22D3EE" 
                strokeWidth={3}
                name="Sentiment Divergence"
              />
              <Line 
                type="monotone" 
                dataKey="topicDivergence" 
                stroke="#F97316" 
                strokeWidth={3}
                name="Topic Divergence"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* Chaos Metrics Grid - Based on Actual Data */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🔬 Complexity Indicators
          <span className="text-sm text-blue-600 font-normal">({exchanges.length} Exchanges)</span>
        </h3>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chaosData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-3">
              <h4 className="font-semibold text-gray-800 mb-1">{item.label}</h4>
              
              <div className="space-y-3">
                <MiniMetricBar
                  label="Entropy"
                  value={item.entropy}
                  color="#9F7AEA"
                  percentage={true}
                />
                
                <MiniMetricBar
                  label="Emergence"
                  value={item.emergence}
                  color="#A855F7"
                  percentage={true}
                />
                
                <MiniMetricBar
                  label="Instability"
                  value={item.systemInstability}
                  color="#8B5CF6"
                  percentage={true}
                />
                
                <MiniMetricBar
                  label="Adaptive Capacity"
                  value={item.adaptiveCapacity}
                  color="#10B981"
                  percentage={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theoretical Context */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
          🌀 Chaos Theory & Complex Systems
        </h4>
        <p className="text-sm text-gray-700 mb-3">
          This analysis applies chaos theory and complexity science to examine non-linear dynamics, 
          emergent patterns, and sensitive dependence on initial conditions within your conversation patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <strong>🌪️ Entropy:</strong> Measures disorder and unpredictability in your conversation patterns
          </div>
          <div>
            <strong>✨ Emergence:</strong> New patterns and insights arising from conversation complexity
          </div>
          <div>
            <strong>⚡ Instability:</strong> System sensitivity to small changes in farming approaches
          </div>
          <div>
            <strong>🔄 Adaptive Capacity:</strong> Your ability to incorporate new information and adjust
          </div>
        </div>
      </div>
    </div>
  );
}