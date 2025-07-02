import React, { useState, useRef } from 'react';
import { AnalysisResult, generateSpeech, isApiAuthError } from '@/utils/api';
import { useDebug } from '@/hooks/useDebug';
import { useLens } from '@/hooks/useLens';
import { LENSES } from '@/utils/lenses';
import SESCharts from './visuals/SESCharts';
import ChaosCharts from './visuals/ChaosCharts';
import BojeCharts from './visuals/BojeCharts';
import PhilosophicalAnalysisChart from './Charts/PhilosophicalAnalysisChart';
import SimpleTimelineChart from './Charts/SimpleTimelineChart';
import ComplexityEmergenceTimeline from './Charts/ComplexityEmergenceTimeline';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ResultsPanelProps {
  results: AnalysisResult | null;
  voiceEnabled: boolean;
  onApiError?: (error: any) => void;
  conversationHistory?: Message[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, voiceEnabled, onApiError, conversationHistory }) => {
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsError, setTtsError] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { lens } = useLens();

  // Debug logging
  useDebug('analysisResult', {
    hasResults: !!results,
    themesCount: results?.themes?.length || 0,
    seriesCount: Object.keys(results?.series || {}).length,
    hasSummary: !!results?.summary,
    voiceEnabled,
    isGeneratingSpeech,
    isPlayingAudio,
    hasTtsError: !!ttsError
  }, [results, voiceEnabled, isGeneratingSpeech, isPlayingAudio, ttsError]);

  if (!results) return null;

  const chartByLens = {
    SES: <SESCharts results={results} />,
    Chaos: <ChaosCharts results={results} />,
    Boje: <BojeCharts results={results} />,
    Philosophy: <PhilosophicalAnalysisChart data={results.comprehensiveAnalysis} title="Philosophical & Systems Analysis" />,
  };

  const handlePlaySummary = async () => {
    if (!results.summary || !voiceEnabled) return;

    try {
      setIsGeneratingSpeech(true);
      setTtsError(null);
      const audioBlob = await generateSpeech(results.summary);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onpause = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        console.error('Error playing audio');
        alert('Failed to play audio. Please try again.');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      setTtsError(error);
      if (onApiError) onApiError(error);
      
      if (isApiAuthError(error)) {
        alert('Voice synthesis unavailable – API key misconfigured.');
      } else {
        alert('Failed to generate speech. Please try again.');
      }
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current && isPlayingAudio) {
      audioRef.current.pause();
    }
  };

  const ttsWorking = !(ttsError && isApiAuthError(ttsError));

  return (
    <div className="card-glass">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 fade-slide flex items-center gap-3">
        <span className="text-3xl">{LENSES[lens].emoji}</span>
        {LENSES[lens].title} Analysis
      </h2>
      
      {results.summary && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
            {voiceEnabled && ttsWorking && (
              <div className="flex gap-2">
                <button
                  onClick={handlePlaySummary}
                  disabled={isGeneratingSpeech || isPlayingAudio}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isGeneratingSpeech ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating... (~5-10s)
                    </>
                  ) : (
                    <>🔊 Play Summary</>
                  )}
                </button>
                {isPlayingAudio && (
                  <button
                    onClick={handlePauseAudio}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ⏸️ Pause
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="whitespace-pre-wrap text-gray-600">{results.summary}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Key Themes</h3>
        <div className="flex flex-wrap gap-2">
          {results.themes.map((theme, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Complexity Emergence Timeline - Real Exchange Analysis */}
      <ComplexityEmergenceTimeline 
        results={results}
        conversationHistory={conversationHistory}
      />

      {/* Lens-specific chart rendering */}
      <div className="mt-6">
        {chartByLens[lens]}
      </div>
    </div>
  );
};