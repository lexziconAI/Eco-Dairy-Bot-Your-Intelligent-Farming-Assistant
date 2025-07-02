import { useState, useRef, useCallback } from 'react';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted, creating MediaRecorder...');
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Audio data received:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('⏹️ Recording stopped, creating blob from', chunksRef.current.length, 'chunks');
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('🎵 Audio blob created:', blob.size, 'bytes');
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onstart = () => {
        console.log('🔴 Recording started');
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('🎙️ MediaRecorder.start() called');
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      alert('Please allow microphone access to use voice recording. Make sure you\'re using HTTPS or localhost.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('🛑 Stop recording requested, isRecording:', isRecording);
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Calling MediaRecorder.stop()');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.log('⚠️ Cannot stop - no recorder or not recording');
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
  };
};