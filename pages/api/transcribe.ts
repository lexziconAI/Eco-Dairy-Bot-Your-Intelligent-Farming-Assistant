import { NextApiRequest, NextApiResponse } from 'next';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', // Increased for audio files
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = randomUUID();
  const t0 = Date.now();
  
  log('info', `[${requestId}] ${req.url} START`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    log('warn', `[${requestId}] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  log('debug', `[${requestId}] OpenAI API key present:`, !!apiKey);
  
  if (!apiKey) {
    log('error', `[${requestId}] OpenAI API key not configured`);
    return res.status(503).json({ 
      code: 'NO_OPENAI_KEY',
      message: 'OpenAI API key not configured' 
    });
  }

  try {
    const { audio, audioBase64 } = req.body;
    const base64Audio = audioBase64 || audio;
    
    if (!base64Audio) {
      log('error', `[${requestId}] No audio data provided in request`);
      return res.status(400).json({ error: 'No audio data provided' });
    }

    log('info', `[${requestId}] Processing audio with OpenAI Whisper`, { 
      payloadSize: base64Audio.length, 
      ip: req.headers['x-forwarded-for'] 
    });
    
    // Extract the base64 data and convert to buffer
    const base64Data = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
    const audioBuffer = Buffer.from(base64Data, 'base64');
    log('debug', `[${requestId}] Audio buffer created`, { bufferSize: audioBuffer.length });

    // Create FormData for OpenAI Whisper API
    const form = new FormData();
    form.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    form.append('model', 'whisper-1');
    form.append('language', 'en'); // Optimize for English
    form.append('prompt', 'This is a conversation about dairy farming, agriculture, sustainability, and farm management.');

    log('debug', `[${requestId}] Calling OpenAI Whisper API...`);
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: form
    });

    if (!response.ok) {
      const errorText = await response.text();
      log('error', `[${requestId}] OpenAI API error`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 401) {
        return res.status(401).json({
          code: 'BAD_API_KEY',
          message: 'OpenAI API key is invalid'
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const transcript = result.text || '';

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0, 
      textLength: transcript.length 
    });
    
    return res.status(200).json({ transcript });
    
  } catch (error: any) {
    log('error', `[${requestId}] ERR`, {
      message: error.message,
      ms: Date.now() - t0
    });
    
    // Handle authentication errors specifically
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return res.status(401).json({
        code: 'BAD_API_KEY',
        message: 'OpenAI API key rejected'
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Failed to transcribe audio',
      details: error.message 
    });
  }
}