import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { BrainDumpPanel } from '@/components/BrainDumpPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { HistoryDrawer, HistoryEntry } from '@/components/HistoryDrawer';
import { analyzeText, AnalysisResult } from '@/utils/api';
import { LensSelector } from '@/components/LensSelector';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
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

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeText(text);
      setResults(analysisResult);
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        text,
        themes: analysisResult.themes,
        timestamp: new Date(),
      };
      
      saveHistory([newEntry, ...history]);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setIsHistoryOpen(false);
    handleAnalyze(entry.text);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
          <BrainDumpPanel 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
            onApiError={handleApiError}
          />
          
          {/* Help & Tips Section */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use voice recording for hands-free brain dumping</li>
              <li>• Type directly if voice isn't available</li>
              <li>• Use the "Play Summary" button to hear the AI's interpretation in Antoni's voice</li>
              <li>• Toggle Voice Output off if you'd rather read the summary</li>
              <li>• Check your history for previous analyses</li>
              <li>• Enable verbose logs by adding ?debug to the URL or setting LOG_LEVEL=debug in Dev-Tools → Application → Local Storage → eco_dairy_bot_log_level</li>
            </ul>
          </div>
        </div>
        
        <div>
          <ResultsPanel 
            results={results} 
            voiceEnabled={voiceEnabled} 
            onApiError={handleApiError}
          />
        </div>
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