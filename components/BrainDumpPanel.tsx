import React, { useState } from 'react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { transcribeAudio, isApiAuthError } from '@/utils/api';
import { useDebug } from '@/hooks/useDebug';

interface BrainDumpPanelProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  onApiError?: (error: any) => void;
}

export const BrainDumpPanel: React.FC<BrainDumpPanelProps> = ({ onAnalyze, isAnalyzing, onApiError }) => {
  const [text, setText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<any>(null);
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useVoiceRecording();

  // Debug logging
  useDebug('recordingState', { 
    isRecording, 
    hasAudioBlob: !!audioBlob, 
    isTranscribing,
    textLength: text.length,
    hasTranscribeError: !!transcribeError
  }, [isRecording, audioBlob, isTranscribing, text.length, transcribeError]);

  const handleRecord = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearRecording();
      setText('');
      setTranscribeError(null);
      startRecording();
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    setTranscribeError(null);
    try {
      const transcript = await transcribeAudio(audioBlob);
      setText(transcript);
      clearRecording();
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscribeError(error);
      if (onApiError) onApiError(error);
      
      if (isApiAuthError(error)) {
        alert('Voice transcription unavailable – API key misconfigured.');
      } else {
        alert('Failed to transcribe audio. Please try again.');
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Brain Dump</h2>
      
      <div className="mb-4">
        <button
          onClick={handleRecord}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : transcribeError && isApiAuthError(transcribeError)
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={isTranscribing || (transcribeError && isApiAuthError(transcribeError))}
          title={
            transcribeError && isApiAuthError(transcribeError)
              ? 'Voice transcription unavailable – API key misconfigured'
              : isRecording 
              ? 'Stop recording' 
              : 'Start recording'
          }
        >
          {isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
        </button>
        
        {audioBlob && !isRecording && (
          <button
            onClick={handleTranscribe}
            className="ml-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            disabled={isTranscribing}
          >
            {isTranscribing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Transcribing...
              </>
            ) : (
              <>📝 Transcribe</>
            )}
          </button>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or record your thoughts here…"
        className="w-full min-h-[6rem] h-40 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isTranscribing}
      />

      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || isAnalyzing || isTranscribing}
        className="mt-4 w-full sm:w-auto px-8 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing... (~5-15s)
          </>
        ) : (
          <>🧠 Analyze</>
        )}
      </button>
    </div>
  );
};