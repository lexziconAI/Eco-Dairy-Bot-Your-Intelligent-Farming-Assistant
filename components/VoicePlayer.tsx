import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';
import { generateSpeech, isApiAuthError } from '@/utils/api';

interface VoicePlayerProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  onError?: (error: any) => void;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  className = '',
  size = 'md',
  variant = 'primary',
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateAudio = async () => {
    if (isLoading || !text.trim()) return;

    try {
      setIsLoading(true);
      setHasError(false);
      
      // Generate speech using Antonia voice
      const audioBlob = await generateSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
      
      // Create new audio element
      const audio = new Audio(url);
      audioRef.current = audio;
      
      // Set up event listeners
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        // Clean up after playing
        URL.revokeObjectURL(url);
        setAudioUrl(null);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setHasError(true);
        console.error('Audio playback error');
      };
      
      // Start playing
      await audio.play();
      
    } catch (error) {
      console.error('Voice generation error:', error);
      setHasError(true);
      setIsPlaying(false);
      
      if (onError) {
        onError(error);
      }
      
      if (isApiAuthError(error)) {
        console.error('Voice synthesis unavailable – API key issue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current || !audioUrl) {
      // Generate and play new audio
      await generateAudio();
      return;
    }

    if (isPlaying) {
      // Pause current audio
      audioRef.current.pause();
    } else {
      // Resume current audio
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Resume playback error:', error);
        // If resume fails, generate new audio
        await generateAudio();
      }
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Button styling based on props
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={togglePlayback}
        disabled={isLoading || hasError || !text.trim()}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full
          border-0
          shadow-sm
          transition-all
          duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
          focus:ring-offset-2
          flex
          items-center
          justify-center
        `}
        title={
          hasError 
            ? 'Voice unavailable' 
            : isLoading 
              ? 'Generating speech...' 
              : isPlaying 
                ? 'Pause speech' 
                : 'Play speech'
        }
        aria-label={
          isPlaying ? 'Pause speech' : 'Play speech'
        }
      >
        {isLoading ? (
          <Loader size={iconSize} className="animate-spin" />
        ) : hasError ? (
          <VolumeX size={iconSize} />
        ) : isPlaying ? (
          <Pause size={iconSize} />
        ) : (
          <Volume2 size={iconSize} />
        )}
      </button>

      {isPlaying && (
        <button
          onClick={stopPlayback}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
          title="Stop playback"
        >
          Stop
        </button>
      )}

      {hasError && (
        <span className="text-xs text-red-500" title="Voice synthesis unavailable">
          Voice unavailable
        </span>
      )}
    </div>
  );
};