import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ComposedChart, Area, Line } from 'recharts';
import { AnalysisResult } from '@/utils/api';
import ChartCaption from '@/components/ChartCaption';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ComplexityEmergenceTimelineProps {
  results: AnalysisResult;
  conversationHistory?: Message[];
}

interface ExchangeAnalysis {
  exchangeId: number;
  label: string;
  userMessage: string;
  botResponse: string;
  topics: string[];
  topicDiversity: number;
  orientationShift: number;
  inferenceConfidence: number;
  emotionalVolatility: number;
  questionStatementRatio: number;
  sentenceCount: number;
  // Quantum Storytelling Analysis
  antenarrative: number;  // Pre-structured tensions/fragments
  grandNarrative: number; // Coherent, official story
  livingStory: number;    // Embodied, lived reality
  narrativeTension: number; // Conflict between narratives
}

// Analyze individual conversation exchange using Quantum Storytelling framework
function analyzeExchange(userMsg: string, botMsg: string, exchangeId: number): ExchangeAnalysis {
  const combinedText = userMsg + ' ' + botMsg;
  const words = combinedText.toLowerCase().split(/\s+/);
  const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Topic detection (simple keyword-based)
  const farmingTopics = {
    'sustainability': /sustain|environment|green|eco|climate/gi,
    'technology': /tech|digital|ai|automation|sensor/gi,
    'economics': /cost|profit|money|price|economic|financial/gi,
    'community': /family|community|neighbor|local|tradition/gi,
    'welfare': /animal|welfare|care|health|treatment/gi,
    'future': /future|change|evolv|transform|next|tomorrow/gi
  };
  
  const detectedTopics = Object.keys(farmingTopics).filter(topic => 
    farmingTopics[topic as keyof typeof farmingTopics].test(combinedText)
  );
  
  // Calculate metrics
  const topicDiversity = detectedTopics.length / Object.keys(farmingTopics).length;
  
  // Emotional volatility (based on exclamation, questions, uncertainty words)
  const emotionalMarkers = (combinedText.match(/[!?]|(uncertain|worried|concerned|excited|hopeful)/gi) || []).length;
  const emotionalVolatility = Math.min(emotionalMarkers / sentences.length, 1);
  
  // Question vs statement ratio
  const questions = (combinedText.match(/\?/g) || []).length;
  const questionStatementRatio = questions / Math.max(sentences.length - questions, 1);
  
  // Quantum Storytelling Analysis
  
  // Antenarrative: Pre-structured, fragmented emerging concerns
  const anteMarkers = /but|however|maybe|might|uncertain|unclear|complex|challenge/gi;
  const antenarrative = Math.min((userMsg.match(anteMarkers) || []).length / 10, 1);
  
  // Grand Narrative: Coherent, structured official story
  const grandMarkers = /should|must|always|never|best practice|standard|proven|established/gi;
  const grandNarrative = Math.min((combinedText.match(grandMarkers) || []).length / 8, 1);
  
  // Living Story: Embodied, actual lived experience
  const livingMarkers = /we|i|my|our|actually|really|experience|feel|daily|practice/gi;
  const livingStory = Math.min((combinedText.match(livingMarkers) || []).length / 15, 1);
  
  // Narrative tension: Conflict between different story types
  const tensionMarkers = /conflict|tension|struggle|balance|difficult|torn|contradiction/gi;
  const narrativeTension = Math.min((combinedText.match(tensionMarkers) || []).length / 5, 1);
  
  return {
    exchangeId,
    label: `Exchange ${exchangeId}`,
    userMessage: userMsg,
    botResponse: botMsg,
    topics: detectedTopics,
    topicDiversity,
    orientationShift: Math.random() * 0.3 + 0.1, // Simplified for now
    inferenceConfidence: 0.7 + Math.random() * 0.3,
    emotionalVolatility,
    questionStatementRatio,
    sentenceCount: sentences.length,
    antenarrative,
    grandNarrative,
    livingStory,
    narrativeTension
  };
}

export default function ComplexityEmergenceTimeline({ results, conversationHistory }: ComplexityEmergenceTimelineProps) {
  // Analyze actual conversation exchanges
  const exchangeAnalysis = React.useMemo(() => {
    if (!conversationHistory || conversationHistory.length < 2) {
      return [];
    }
    
    const exchanges: ExchangeAnalysis[] = [];
    const userMessages = conversationHistory.filter(msg => msg.type === 'user');
    const botMessages = conversationHistory.filter(msg => msg.type === 'bot');
    
    // Match user messages with bot responses
    for (let i = 0; i < userMessages.length; i++) {
      const userMsg = userMessages[i];
      const botMsg = botMessages.find(bot => bot.timestamp > userMsg.timestamp);
      
      if (botMsg) {
        exchanges.push(analyzeExchange(userMsg.content, botMsg.content, i + 1));
      }
    }
    
    return exchanges;
  }, [conversationHistory]);
  
  console.log('Exchange Analysis:', exchangeAnalysis);

  // Don't render if no actual conversation data
  if (!conversationHistory || conversationHistory.length < 2) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          📈 Complexity Emergence Timeline
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-center py-8">
            Start a conversation to see complexity emergence analysis.
            <br />
            <span className="text-sm">This chart shows real exchange-by-exchange analysis, not phantom data.</span>
          </p>
        </div>
      </div>
    );
  }
  
  if (exchangeAnalysis.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          📈 Complexity Emergence Timeline
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-center py-8">
            Continue the conversation to see complexity patterns emerge.
            <br />
            <span className="text-sm text-blue-600">Currently {conversationHistory.filter(m => m.type === 'user').length} user message(s) detected</span>
          </p>
        </div>
      </div>
    );
  }

  const palette = ['#6366F1', '#A855F7', '#EC4899', '#22D3EE', '#F97316', '#10B981'];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        📈 Complexity Emergence Timeline
        <span className="text-sm text-blue-600 font-normal">({exchangeAnalysis.length} Real Exchanges)</span>
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        {/* Exchange-by-Exchange Complexity */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-600">🎯 Exchange Complexity Analysis</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exchangeAnalysis} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  domain={[0, 1]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Complexity Score', angle: -90, position: 'insideLeft' }}
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
                  labelFormatter={(label) => `${label} Analysis`}
                />
                <Bar dataKey="topicDiversity" fill={palette[0]} name="Topic Diversity" />
                <Bar dataKey="emotionalVolatility" fill={palette[1]} name="Emotional Volatility" />
                <Bar dataKey="narrativeTension" fill={palette[2]} name="Narrative Tension" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantum Storytelling Analysis */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-600 flex items-center gap-2">
            🌀 Quantum Storytelling Analysis (Boje Framework)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={exchangeAnalysis} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
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
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="antenarrative" 
                  stackId="1" 
                  stroke="#F6C177" 
                  fill="#F6C177" 
                  fillOpacity={0.6}
                  name="Antenarrative (Emerging Tensions)"
                />
                <Area 
                  type="monotone" 
                  dataKey="grandNarrative" 
                  stackId="1" 
                  stroke="#FFD3A5" 
                  fill="#FFD3A5" 
                  fillOpacity={0.6}
                  name="Grand Narrative (Official Story)"
                />
                <Area 
                  type="monotone" 
                  dataKey="livingStory" 
                  stackId="1" 
                  stroke="#FDE68A" 
                  fill="#FDE68A" 
                  fillOpacity={0.6}
                  name="Living Story (Lived Reality)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Exchange Breakdown */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-600">📊 Exchange Details</h4>
          <div className="grid gap-4">
            {exchangeAnalysis.map((exchange, index) => (
              <div key={exchange.exchangeId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-800">{exchange.label}</h5>
                  <span className="text-sm text-gray-500">{exchange.topics.length} topics detected</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exchange.topics.map(topic => (
                        <span key={topic} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Diversity:</span>
                    <div className="font-semibold text-green-600">
                      {(exchange.topicDiversity * 100).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Emotion:</span>
                    <div className="font-semibold text-purple-600">
                      {(exchange.emotionalVolatility * 100).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Q/S Ratio:</span>
                    <div className="font-semibold text-orange-600">
                      {exchange.questionStatementRatio.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Quantum Storytelling Breakdown */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-600 mb-2">Quantum Storytelling Composition:</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                      <span>Antenarrative: {(exchange.antenarrative * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                      <span>Grand Narrative: {(exchange.grandNarrative * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Living Story: {(exchange.livingStory * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <ChartCaption>
          This analysis shows the actual complexity emergence from your {exchangeAnalysis.length} conversation exchange(s). 
          Each exchange is analyzed for topic diversity, emotional patterns, and David Boje's quantum storytelling framework: 
          <strong>Antenarrative</strong> (emerging tensions), <strong>Grand Narrative</strong> (official story), 
          and <strong>Living Story</strong> (lived reality). No phantom data—only real conversation patterns.
        </ChartCaption>
      </div>
    </div>
  );
}