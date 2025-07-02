import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
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

  const apiKey = process.env.ELEVENLABS_API_KEY;
  log('debug', `[${requestId}] API key present:`, !!apiKey);
  
  if (!apiKey) {
    log('error', `[${requestId}] ElevenLabs API key not configured`);
    return res.status(503).json({ 
      code: 'NO_ELEVEN_KEY',
      message: 'ElevenLabs API key not configured' 
    });
  }

  try {
    const { audio, audioBase64 } = req.body;
    const base64Audio = audioBase64 || audio;
    
    if (!base64Audio) {
      log('error', `[${requestId}] No audio data provided in request`);
      return res.status(400).json({ error: 'No audio data provided' });
    }

    log('info', `[${requestId}] Processing audio`, { 
      payloadSize: base64Audio.length, 
      ip: req.headers['x-forwarded-for'] 
    });
    
    const base64Data = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
    const audioBuffer = Buffer.from(base64Data, 'base64');
    log('debug', `[${requestId}] Audio buffer created`, { bufferSize: audioBuffer.length });

    const form = new FormData();
    form.append('file', audioBuffer, { 
      filename: 'audio.webm', 
      contentType: 'audio/webm' 
    });
    form.append('model_id', 'scribe_v1');

    log('debug', `[${requestId}] Calling ElevenLabs STT API...`);
    const resp = await axios.post(
      'https://api.elevenlabs.io/v1/speech-to-text',
      form,
      {
        headers: {
          'xi-api-key': apiKey,
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0, 
      textLength: resp.data.text?.length || 0 
    });
    return res.status(200).json({ transcript: resp.data.text });
  } catch (error: any) {
    log('error', `[${requestId}] ERR`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      ms: Date.now() - t0
    });
    
    // Handle authentication errors specifically
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({
        code: 'BAD_API_KEY',
        message: 'Upstream rejected API key'
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Failed to transcribe audio',
      details: error.response?.data || error.message 
    });
  }
}