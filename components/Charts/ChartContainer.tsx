import React, { ReactNode } from 'react';
import { ConversationDataStore } from '@/utils/conversationDataStore';

interface TechnicalExplanationProps {
  title: string;
  description: string;
  dataSource: string;
  scaleInfo?: string;
  children?: ReactNode;
}

interface PersonalInsightsProps {
  exchangeCount: number;
  patterns: string[];
  interpretations: string[];
  actionableAdvice: string[];
  children?: ReactNode;
}

interface ChartContainerProps {
  title: string;
  emoji: string;
  conversationData: ConversationDataStore;
  technicalExplanation: Omit<TechnicalExplanationProps, 'title'>;
  personalInsights: Omit<PersonalInsightsProps, 'exchangeCount'>;
  children: ReactNode;
  minimumExchanges?: number;
}

export function TechnicalExplanation({ 
  title, 
  description, 
  dataSource, 
  scaleInfo,
  children 
}: TechnicalExplanationProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        📊 {title}
      </h4>
      <div className="text-sm text-blue-700 space-y-2">
        <p><strong>What This Shows:</strong> {description}</p>
        <p><strong>Data Source:</strong> {dataSource}</p>
        {scaleInfo && <p><strong>How to Read It:</strong> {scaleInfo}</p>}
        {children}
      </div>
    </div>
  );
}

export function PersonalInsights({ 
  exchangeCount, 
  patterns, 
  interpretations, 
  actionableAdvice,
  children 
}: PersonalInsightsProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
        💡 Your Conversation Analysis
      </h4>
      <div className="text-sm text-green-700">
        <p className="mb-3">Based on your <strong>{exchangeCount} exchange{exchangeCount !== 1 ? 's' : ''}</strong>:</p>
        
        {patterns.length > 0 && (
          <div className="mb-3">
            <p className="font-medium mb-1">Patterns Detected:</p>
            <ul className="list-disc list-inside space-y-1">
              {patterns.map((pattern, index) => (
                <li key={index}>{pattern}</li>
              ))}
            </ul>
          </div>
        )}
        
        {interpretations.length > 0 && (
          <div className="mb-3">
            <p className="font-medium mb-1">This Suggests:</p>
            <ul className="list-disc list-inside space-y-1">
              {interpretations.map((interpretation, index) => (
                <li key={index}>{interpretation}</li>
              ))}
            </ul>
          </div>
        )}
        
        {actionableAdvice.length > 0 && (
          <div>
            <p className="font-medium mb-1">Consider:</p>
            <ul className="list-disc list-inside space-y-1">
              {actionableAdvice.map((advice, index) => (
                <li key={index}>{advice}</li>
              ))}
            </ul>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}

export function InsufficientDataFallback({ 
  title, 
  emoji, 
  currentExchanges, 
  minimumRequired,
  explanation 
}: {
  title: string;
  emoji: string;
  currentExchanges: number;
  minimumRequired: number;
  explanation: string;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        {emoji} {title}
      </h3>
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Gathering Initial Insights</h4>
          <p className="text-gray-600 mb-4">
            You have <strong>{currentExchanges}</strong> exchange{currentExchanges !== 1 ? 's' : ''}. 
            This chart needs <strong>{minimumRequired}</strong> exchanges for meaningful analysis.
          </p>
          <p className="text-sm text-gray-500 italic">{explanation}</p>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">Continue the conversation to unlock:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Detailed pattern analysis</li>
              <li>• Trend visualization</li>
              <li>• Personalized insights</li>
              <li>• Strategic recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChartContainer({ 
  title, 
  emoji, 
  conversationData, 
  technicalExplanation,
  personalInsights,
  children,
  minimumExchanges = 1
}: ChartContainerProps) {
  const exchangeCount = conversationData.exchanges.length;
  
  // Show fallback if insufficient data
  if (exchangeCount < minimumExchanges) {
    return (
      <InsufficientDataFallback
        title={title}
        emoji={emoji}
        currentExchanges={exchangeCount}
        minimumRequired={minimumExchanges}
        explanation={`This visualization analyzes ${technicalExplanation.description.toLowerCase()}, which requires multiple conversation exchanges to detect meaningful patterns.`}
      />
    );
  }
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        {emoji} {title}
        <span className="text-sm text-blue-600 font-normal">
          ({exchangeCount} Real Exchange{exchangeCount !== 1 ? 's' : ''})
        </span>
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <TechnicalExplanation
          title={`What "${title}" Shows`}
          description={technicalExplanation.description}
          dataSource={technicalExplanation.dataSource}
          scaleInfo={technicalExplanation.scaleInfo}
        />
        
        <div className="my-6">
          {children}
        </div>
        
        <PersonalInsights
          exchangeCount={exchangeCount}
          patterns={personalInsights.patterns}
          interpretations={personalInsights.interpretations}
          actionableAdvice={personalInsights.actionableAdvice}
        />
      </div>
    </div>
  );
}