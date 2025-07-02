// Helper to check if error is API authentication related
export function isApiAuthError(error: any): boolean {
  const authCodes = ['NO_ELEVEN_KEY', 'NO_OPENAI_KEY', 'BAD_API_KEY'];
  return error && typeof error === 'object' && authCodes.includes(error.code);
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.readAsDataURL(audioBlob);
  });

  const base64Audio = await base64Promise;

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audioBase64: base64Audio }),
  });

  if (!response.ok) {
    const error = await response.json();
    const apiError = new Error(error.message || error.error || 'Failed to transcribe audio');
    (apiError as any).code = error.code;
    throw apiError;
  }

  const data = await response.json();
  return data.transcript;
}

export interface AnalysisResult {
  themes: string[];
  series?: Record<string, number[]>; // Legacy field for backward compatibility
  dairyMetrics?: Record<string, number[]>; // New dairy-specific metrics
  summary?: string;
  insights?: string; // New field from updated API
  nextSteps?: string[]; // New field from updated API
  timelineData?: Array<{ step: number; [metric: string]: number }>;
  // Enhanced analysis fields
  analysisMetadata?: {
    sessionId: string;
    orientation: string;
    emotionalTone: string;
    engagementLevel: string;
    detectedClues: {
      linguisticMarkers: number;
      topicPatterns: number;
      contradictions: number;
    };
    timestamp: number;
  };
  visualizationData?: any;
  matrixAnalysis?: any;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    const apiError = new Error(error.message || error.error || 'Failed to analyze text');
    (apiError as any).code = error.code;
    throw apiError;
  }

  return response.json();
}

export async function generateSpeech(text: string): Promise<Blob> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    const apiError = new Error(error.message || error.error || 'Failed to generate speech');
    (apiError as any).code = error.code;
    throw apiError;
  }

  return response.blob();
}