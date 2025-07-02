import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { ConversationDataStore, createConversationDataStore } from '@/utils/conversationDataStore';
import ChartContainer from './ChartContainer';
import SimpleMetricDisplay from './SimpleMetricDisplay';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ComplexityEmergenceTimelineProps {
  conversationHistory?: Message[];
}

export default function ComplexityEmergenceTimeline({ conversationHistory }: ComplexityEmergenceTimelineProps) {
  // Create conversation data store from message history
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
  
  // For very short conversations, show simple metrics instead
  if (exchanges.length < 2) {
    return (
      <SimpleMetricDisplay
        conversationData={conversationData}
        title="Initial Conversation Insights"
        emoji="📊"
      />
    );
  }

  // Prepare chart data for visualization
  const chartData = exchanges.map((exchange, index) => ({
    label: `Exchange ${index + 1}`,
    complexity: exchange.analysis.complexity,
    topicDiversity: exchange.analysis.topicDiversity,
    emotionalVolatility: exchange.analysis.emotionalVolatility,
    narrativeTension: exchange.analysis.narrativeTension,
    antenarrative: exchange.analysis.antenarrative,
    grandNarrative: exchange.analysis.grandNarrative,
    livingStory: exchange.analysis.livingStory
  }));
  
  // Generate insights for this specific conversation
  const patterns: string[] = [];
  const interpretations: string[] = [];
  const actionableAdvice: string[] = [];
  
  // Analyze patterns
  const avgComplexity = exchanges.reduce((sum, e) => sum + e.analysis.complexity, 0) / exchanges.length;
  if (avgComplexity > 0.7) {
    patterns.push("High complexity conversations with multiple interconnected themes");
    interpretations.push("You think systemically about farming challenges");
  } else if (avgComplexity < 0.3) {
    patterns.push("Focused, straightforward discussion style");
    interpretations.push("You prefer clear, direct approaches to farming decisions");
  }
  
  // Check for topic diversity trends
  if (exchanges.length > 1) {
    const diversityTrend = exchanges[exchanges.length - 1].analysis.topicDiversity - exchanges[0].analysis.topicDiversity;
    if (diversityTrend > 0.2) {
      patterns.push("Expanding topic range over time");
      interpretations.push("Your awareness of farming interconnections is growing");
    }
  }
  
  // Check narrative types
  const avgLivingStory = exchanges.reduce((sum, e) => sum + e.analysis.livingStory, 0) / exchanges.length;
  if (avgLivingStory > 0.6) {
    patterns.push("Experience-driven communication style");
    interpretations.push("You rely heavily on practical, lived experience in farming");
    actionableAdvice.push("Consider documenting your experiences to share with other farmers");
  }
  
  // Check emotional patterns
  const avgEmotionalVolatility = exchanges.reduce((sum, e) => sum + e.analysis.emotionalVolatility, 0) / exchanges.length;
  if (avgEmotionalVolatility > 0.5) {
    patterns.push("Emotionally engaged with farming topics");
    interpretations.push("Farming decisions carry significant personal meaning for you");
    actionableAdvice.push("Consider stress management strategies for high-stakes decisions");
  }
  
  // General advice based on exchange count
  if (exchanges.length < 5) {
    actionableAdvice.push("Continue the conversation to unlock deeper analytical insights");
  }
  
  return (
    <ChartContainer
      title="Complexity Emergence Timeline"
      emoji="📈"
      conversationData={conversationData}
      minimumExchanges={2}
      technicalExplanation={{
        description: "How conversation complexity evolves across actual exchanges, measuring topic diversity, emotional engagement, and narrative structure",
        dataSource: "Real conversation analysis - each data point represents one user-bot exchange",
        scaleInfo: "Y-axis shows 0-100% intensity. Bars represent different complexity dimensions per exchange."
      }}
      personalInsights={{
        patterns,
        interpretations,
        actionableAdvice
      }}
    >
      <div className="space-y-6">
        {/* Complexity Evolution Chart */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">🎯 Complexity Evolution</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  domain={[0, 1]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Intensity (0-100%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.875rem'
                  }}
                  formatter={(value: number, name: string) => [
                    `${(value * 100).toFixed(1)}%`,
                    name.replace(/([A-Z])/g, ' $1').trim()
                  ]}
                />
                <Bar dataKey="complexity" fill="#6366F1" name="Overall Complexity" />
                <Bar dataKey="topicDiversity" fill="#10B981" name="Topic Diversity" />
                <Bar dataKey="emotionalVolatility" fill="#F59E0B" name="Emotional Engagement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantum Storytelling Analysis */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">🌀 Narrative Structure (Boje Framework)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  domain={[0, 1]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Narrative Intensity', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.875rem'
                  }}
                  formatter={(value: number, name: string) => [
                    `${(value * 100).toFixed(1)}%`,
                    name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="antenarrative" 
                  stackId="1" 
                  stroke="#F6C177" 
                  fill="#F6C177" 
                  fillOpacity={0.7}
                  name="Antenarrative (Emerging Tensions)"
                />
                <Area 
                  type="monotone" 
                  dataKey="grandNarrative" 
                  stackId="1" 
                  stroke="#FFD3A5" 
                  fill="#FFD3A5" 
                  fillOpacity={0.7}
                  name="Grand Narrative (Official Story)"
                />
                <Area 
                  type="monotone" 
                  dataKey="livingStory" 
                  stackId="1" 
                  stroke="#FDE68A" 
                  fill="#FDE68A" 
                  fillOpacity={0.7}
                  name="Living Story (Lived Reality)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}