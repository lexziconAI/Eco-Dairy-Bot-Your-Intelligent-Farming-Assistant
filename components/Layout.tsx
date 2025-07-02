import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onHistoryClick: () => void;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  hasApiErrors?: boolean;
  onShowApiErrors?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onHistoryClick, 
  voiceEnabled, 
  onVoiceToggle, 
  hasApiErrors = false,
  onShowApiErrors 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600">
              Eco Dairy Bot – Your Intelligent Farming Assistant
            </h1>
            <div className="flex items-center gap-4">
              {/* API Error Warning */}
              {hasApiErrors && onShowApiErrors && (
                <button
                  onClick={onShowApiErrors}
                  className="text-amber-500 hover:text-amber-600 p-1 rounded-lg hover:bg-amber-50 transition-colors"
                  title="API configuration issues detected"
                >
                  <span className="text-lg">⚠️</span>
                </button>
              )}
              
              {/* Voice Output Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Voice Output</span>
                <button
                  onClick={onVoiceToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    voiceEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={voiceEnabled}
                  aria-label="Toggle voice output"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-lg" role="img" aria-label={voiceEnabled ? "Voice on" : "Voice off"}>
                  {voiceEnabled ? <span className="text-blue-600">🔊</span> : <span className="text-gray-400">🔇</span>}
                </span>
              </div>
              
              <button
                onClick={onHistoryClick}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                📚 History
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};