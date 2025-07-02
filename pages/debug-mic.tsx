import { useState, useEffect } from 'react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

export default function DebugMic() {
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useVoiceRecording();
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as any });
      setPermissionStatus(result.state);
      console.log('🎤 Microphone permission:', result.state);
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermissionStatus('check-failed');
    }
  };

  const testMediaDevices = async () => {
    try {
      console.log('🎙️ Testing MediaDevices.getUserMedia...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      console.log('🎤 Audio input devices:', audioInputs.length);
      audioInputs.forEach((device, i) => {
        console.log(`  ${i + 1}. ${device.label || 'Unknown device'} (${device.deviceId})`);
      });
    } catch (error) {
      console.error('❌ MediaDevices test failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🎤 Microphone Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Browser Support</h2>
        {isClient ? (
          <>
            <p>MediaDevices supported: {navigator.mediaDevices ? '✅ Yes' : '❌ No'}</p>
            <p>getUserMedia supported: {typeof navigator.mediaDevices?.getUserMedia === 'function' ? '✅ Yes' : '❌ No'}</p>
            <p>MediaRecorder supported: {window.MediaRecorder ? '✅ Yes' : '❌ No'}</p>
            <p>Current URL: {window.location.href}</p>
            <p>Protocol: {window.location.protocol} {window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? '✅' : '⚠️ HTTPS/localhost required'}</p>
          </>
        ) : (
          <p>Loading browser info...</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Permission Status</h2>
        <p>Status: <strong>{permissionStatus}</strong></p>
        <button onClick={checkPermissions} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Check Permissions
        </button>
        <button onClick={testMediaDevices} style={{ padding: '10px 20px' }}>
          List Audio Devices
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Recording Test</h2>
        <p>Status: <strong>{isRecording ? '🔴 Recording' : '⚫ Stopped'}</strong></p>
        <p>Audio blob: {audioBlob ? `✅ ${audioBlob.size} bytes` : '❌ None'}</p>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={startRecording} 
            disabled={isRecording}
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              backgroundColor: isRecording ? '#ccc' : '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            🎤 Start Recording
          </button>
          
          <button 
            onClick={stopRecording} 
            disabled={!isRecording}
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              backgroundColor: !isRecording ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            ⏹️ Stop Recording
          </button>
          
          <button 
            onClick={clearRecording}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {audioBlob && isClient && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Audio Playback</h2>
          <audio controls src={URL.createObjectURL(audioBlob)} style={{ width: '100%' }} />
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Open browser DevTools (F12) → Console tab</li>
          <li>Click "Check Permissions" and "List Audio Devices"</li>
          <li>Click "Start Recording" - you should see permission prompt</li>
          <li>Allow microphone access</li>
          <li>Watch console logs for debug info</li>
          <li>Speak for a few seconds</li>
          <li>Click "Stop Recording"</li>
          <li>Check if audio blob is created and playback works</li>
        </ol>
      </div>
    </div>
  );
}