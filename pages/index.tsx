import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ConversationPanel } from '@/components/ConversationPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { HistoryDrawer, HistoryEntry } from '@/components/HistoryDrawer';
import { analyzeText, AnalysisResult } from '@/utils/api';
import { LensSelector } from '@/components/LensSelector';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [apiErrors, setApiErrors] = useState<any[]>([]);
  const [showApiErrorModal, setShowApiErrorModal] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('eco-dairy-bot-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }));
    }
    
    // Load voice preference from localStorage
    const savedVoiceEnabled = localStorage.getItem('eco_dairy_bot_voice_enabled');
    if (savedVoiceEnabled !== null) {
      setVoiceEnabled(JSON.parse(savedVoiceEnabled));
    }
  }, []);

  const saveHistory = (newHistory: HistoryEntry[]) => {
    const limitedHistory = newHistory.slice(0, 5);
    setHistory(limitedHistory);
    localStorage.setItem('eco-dairy-bot-history', JSON.stringify(limitedHistory));
  };

  const handleAnalyze = async (conversationHistory: Message[]) => {
    setIsAnalyzing(true);
    setCurrentConversation(conversationHistory); // Store current conversation
    try {
      // Combine all user messages for analysis
      const userMessages = conversationHistory.filter(msg => msg.type === 'user');
      const combinedText = userMessages.map(msg => msg.content).join(' ');
      
      if (!combinedText.trim()) {
        alert('No conversation content to analyze.');
        return;
      }
      
      // Pass conversation context to analysis
      const analysisResult = await analyzeText(combinedText, {
        conversationHistory: userMessages.map(msg => ({
          userInput: msg.content,
          timestamp: msg.timestamp,
          detectedTopics: [] // Will be populated by analysis
        }))
      });
      
      setResults(analysisResult);
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        text: `Conversation Analysis (${userMessages.length} messages)`,
        themes: analysisResult.themes,
        timestamp: new Date(),
      };
      
      saveHistory([newEntry, ...history]);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze conversation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setIsHistoryOpen(false);
    // For now, just close the history - in the future we could reload conversation
    // handleAnalyze(entry.text);
  };

  const handleVoiceToggle = () => {
    const newVoiceEnabled = !voiceEnabled;
    setVoiceEnabled(newVoiceEnabled);
    localStorage.setItem('eco_dairy_bot_voice_enabled', JSON.stringify(newVoiceEnabled));
  };

  const handleApiError = (error: any) => {
    setApiErrors(prev => {
      const exists = prev.find(e => e.code === error.code);
      if (exists) return prev;
      return [...prev, error];
    });
  };

  const hasApiErrors = apiErrors.length > 0;

  return (
    <Layout 
      onHistoryClick={() => setIsHistoryOpen(true)}
      voiceEnabled={voiceEnabled}
      onVoiceToggle={handleVoiceToggle}
      hasApiErrors={hasApiErrors}
      onShowApiErrors={() => setShowApiErrorModal(true)}
    >
      <LensSelector />
      <div className="space-y-6">
        <ConversationPanel 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
          onApiError={handleApiError}
          voiceEnabled={voiceEnabled}
        />
        
        {results && (
          <ResultsPanel 
            results={results} 
            voiceEnabled={voiceEnabled} 
            onApiError={handleApiError}
            conversationHistory={currentConversation}
          />
        )}
      </div>
      
      <HistoryDrawer
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleHistorySelect}
      />
      
      {/* API Error Modal */}
      {showApiErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold text-gray-800">API Configuration Issue</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Eco Dairy Bot cannot reach ElevenLabs/OpenAI. Please ask the site owner to set the required environment keys.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Missing or invalid API keys detected:
              <ul className="mt-2 space-y-1">
                {apiErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {error.code === 'NO_ELEVEN_KEY' && 'ElevenLabs API key not configured'}
                    {error.code === 'NO_OPENAI_KEY' && 'OpenAI API key not configured'}
                    {error.code === 'BAD_API_KEY' && 'Invalid API key provided'}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowApiErrorModal(false)}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}